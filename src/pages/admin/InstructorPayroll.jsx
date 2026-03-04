import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  exportPayrollSummary,
  generatePayroll,
  getPayrollBatches,
  getPayrollSummary,
  markBatchPaid,
} from "../../services/admin/payrollService";

const WalletIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21 7H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2m0 10H3V9h18v8M16 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M20 5H4V3h16v2Z"
    />
  </Icon>
);

const UsersIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16 11c1.66 0 2.99-1.79 2.99-4S17.66 3 16 3s-3 1.79-3 4 1.34 4 3 4m-8 0c1.66 0 3-1.79 3-4S9.66 3 8 3 5 4.79 5 7s1.34 4 3 4m0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.94 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z"
    />
  </Icon>
);

const PAGE_SIZE = 5;

const money = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v ?? 0,
  );

// Lấy tháng hiện tại dạng YYYY-MM
const getCurrentMonth = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

// ── helper: lấy field linh hoạt theo response thực tế từ API ──
// Đặt NGOÀI component để tránh lỗi hoisting và không tạo lại mỗi render
const getName = (r) => r.instructorName || r.instructor_name || "Unknown";
const getEmail = (r) =>
  r.instructorEmail || r.instructor_email || r.email || "";
const getRevenue = (r) =>
  parseFloat(r.totalGrossAmount ?? r.totalGross ?? r.total_revenue ?? 0);
const getCommission = (r) =>
  parseFloat(r.totalPlatformFee ?? r.commission_fee ?? 0);
const getNet = (r) =>
  parseFloat(r.totalNetAmount ?? r.totalNet ?? r.net_salary ?? 0);
const getRate = (r) => {
  const revenue = getRevenue(r);
  const commission = getCommission(r);
  if (revenue > 0) return commission / revenue;
  return 0.3;
};

// Thêm helper lấy tổng số học sinh mua course (fallback nhiều key khác nhau)
const getStudentCount = (r) =>
  Number(
    r.totalStudents ??
      r.total_students ??
      r.totalEnrollments ??
      r.total_enrollments ??
      r.studentsCount ??
      r.earningCount ??
      0,
  );

export default function InstructorPayroll() {
  const toast = useToast();

  // ── state ──
  const [month, setMonth] = useState(getCurrentMonth());
  const [summaryRows, setSummaryRows] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // ── theme tokens ──
  const bg = useColorModeValue("gray.50", "gray.900");
  const card = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.100", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.400");

  // ── fetch data khi month thay đổi ──
  const fetchData = async () => {
    try {
      setLoading(true);

      const [summaryRes, batchesRes] = await Promise.all([
        getPayrollSummary(month),
        getPayrollBatches(month),
      ]);

      setSummaryRows(summaryRes.summary ?? []);
      setBatches(batchesRes.batches ?? []);
    } catch (err) {
      toast({
        status: "error",
        title: "Failed to load payroll data",
        description: err?.message || "Something went wrong",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  // ── Merge batch status vào summary rows ──
  const rows = useMemo(() => {
    const batchMap = {};
    batches.forEach((b) => {
      const id = String(b.instructorId ?? b.instructor_id);
      batchMap[id] = b;
    });

    const source = summaryRows.length > 0 ? summaryRows : batches;

    return source.map((row) => {
      const id = String(row.instructorId ?? row.instructor_id);
      const batch = batchMap[id] || {};

      return {
        ...row,
        batchId: batch.batchId ?? batch.batch_id ?? batch.id ?? null,
        batchStatus: batch.status ?? "not_generated",
      };
    });
  }, [summaryRows, batches]);

  // ── search + pagination ──
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(
      (r) =>
        getName(r).toLowerCase().includes(t) ||
        getEmail(r).toLowerCase().includes(t),
    );
  }, [q, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  // ── aggregate stats ──
  const pendingTotal = rows
    .filter((r) => r.batchStatus !== "paid")
    .reduce((s, r) => s + getNet(r), 0);

  const paidTotal = rows
    .filter((r) => r.batchStatus === "paid")
    .reduce((s, r) => s + getNet(r), 0);

  const commissionTotal = rows.reduce((s, r) => s + getCommission(r), 0);

  const activeInstructors = rows.length;

  // ── actions ──
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await generatePayroll(month);
      toast({
        status: "success",
        title: res.message || `Payroll generated for ${month}`,
        duration: 3000,
        isClosable: true,
      });
      await fetchData();
    } catch (err) {
      const isAlreadyGenerated = err?.message
        ?.toLowerCase()
        .includes("already");

      toast({
        status: isAlreadyGenerated ? "warning" : "error",
        title: isAlreadyGenerated
          ? "Payroll already exists"
          : "Generate failed",
        description: err?.message || "Something went wrong",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkPaid = async (batchId) => {
    try {
      setMarkingPaidId(batchId);
      const res = await markBatchPaid(batchId);
      toast({
        status: "success",
        title: res.message || "Batch marked as paid",
        duration: 3000,
        isClosable: true,
      });
      const batchesRes = await getPayrollBatches(month);
      setBatches(batchesRes.batches ?? []);
    } catch (err) {
      toast({
        status: "error",
        title: "Mark paid failed",
        description: err?.message || "Something went wrong",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setMarkingPaidId(null);
    }
  };

  const handleExportSummary = async () => {
    try {
      setExporting(true);
      const { data, filename } = await exportPayrollSummary(month);
      const blob =
        data instanceof Blob
          ? data
          : new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `payroll-summary-${month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        status: "error",
        title: "Export failed",
        description: err?.message || "Something went wrong",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box bg={bg} minH="100vh">
      <AdminNavbar />
      <AdminSidebar />

      <Box
        ml={{ base: 0, md: "256px" }}
        pt="40px"
        px={{ base: 4, md: 8 }}
        pb={8}
      >
        <VStack align="stretch" spacing={6}>
          {/* ── Header ── */}
          <Flex
            justify="space-between"
            align={{ base: "start", md: "end" }}
            wrap="wrap"
            gap={4}
          >
            <Box>
              <Heading size="lg">Instructor Payroll Management</Heading>
              <Text mt={1} color={muted}>
                Manage instructor earnings, commission fees, and salary
                payments.
              </Text>
            </Box>

            <HStack spacing={3} wrap="wrap">
              <Input
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setPage(1);
                }}
                maxW="180px"
                bg={card}
              />
              {/* Chỉ hiện nút Generate khi chưa có batch nào cho tháng này */}
              {batches.length === 0 ? (
                <Button
                  colorScheme="blue"
                  onClick={handleGenerate}
                  isLoading={generating}
                  loadingText="Generating..."
                >
                  Generate Payroll
                </Button>
              ) : (
                <Badge
                  colorScheme="green"
                  fontSize="sm"
                  px={3}
                  py={2}
                  borderRadius="md"
                >
                  ✓ Payroll generated
                </Badge>
              )}
              <Button
                leftIcon={<DownloadIcon />}
                variant="outline"
                onClick={handleExportSummary}
                isLoading={exporting}
                loadingText="Exporting..."
              >
                Export Excel
              </Button>
            </HStack>
          </Flex>

          {/* ── Summary Cards ── */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <Stat
              bg={card}
              borderWidth="1px"
              borderColor={border}
              borderRadius="xl"
              p={5}
            >
              <HStack justify="space-between">
                <Box>
                  <StatLabel>Total Pending Payouts</StatLabel>
                  {loading ? (
                    <Skeleton h="32px" w="120px" mt={1} />
                  ) : (
                    <StatNumber>{money(pendingTotal)}</StatNumber>
                  )}
                </Box>
                <Icon as={WalletIcon} color="yellow.500" boxSize={6} />
              </HStack>
            </Stat>

            <Stat
              bg={card}
              borderWidth="1px"
              borderColor={border}
              borderRadius="xl"
              p={5}
            >
              <HStack justify="space-between">
                <Box>
                  <StatLabel>Total Paid This Month</StatLabel>
                  {loading ? (
                    <Skeleton h="32px" w="120px" mt={1} />
                  ) : (
                    <StatNumber>{money(paidTotal)}</StatNumber>
                  )}
                </Box>
                <CheckCircleIcon color="green.500" boxSize={6} />
              </HStack>
            </Stat>

            <Stat
              bg={card}
              borderWidth="1px"
              borderColor={border}
              borderRadius="xl"
              p={5}
            >
              <HStack justify="space-between">
                <Box>
                  <StatLabel>Total Commission Fee</StatLabel>
                  {loading ? (
                    <Skeleton h="32px" w="120px" mt={1} />
                  ) : (
                    <StatNumber>{money(commissionTotal)}</StatNumber>
                  )}
                </Box>
                <Icon as={WalletIcon} color="red.400" boxSize={6} />
              </HStack>
            </Stat>

            <Stat
              bg={card}
              borderWidth="1px"
              borderColor={border}
              borderRadius="xl"
              p={5}
            >
              <HStack justify="space-between">
                <Box>
                  <StatLabel>Active Instructors</StatLabel>
                  {loading ? (
                    <Skeleton h="32px" w="60px" mt={1} />
                  ) : (
                    <StatNumber>{activeInstructors}</StatNumber>
                  )}
                </Box>
                <Icon as={UsersIcon} color="blue.500" boxSize={6} />
              </HStack>
            </Stat>
          </SimpleGrid>

          {/* ── Table ── */}
          <Box
            bg={card}
            borderWidth="1px"
            borderColor={border}
            borderRadius="xl"
            overflow="hidden"
          >
            <Flex
              p={5}
              borderBottomWidth="1px"
              borderColor={border}
              justify="space-between"
              gap={4}
              wrap="wrap"
            >
              <Heading size="md">
                Payout Requests{" "}
                <Text as="span" fontSize="sm" fontWeight="normal" color={muted}>
                  ({month})
                </Text>
              </Heading>
              <InputGroup maxW="320px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search instructor..."
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                />
              </InputGroup>
            </Flex>

            {loading ? (
              <Flex justify="center" align="center" py={16}>
                <Spinner size="xl" color="blue.400" />
              </Flex>
            ) : items.length === 0 ? (
              <Flex justify="center" align="center" py={16}>
                <Text color={muted}>
                  {q
                    ? "No instructors match your search."
                    : "No payroll data for this month. Click 'Generate Payroll' to create batches."}
                </Text>
              </Flex>
            ) : (
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Instructor Name</Th>
                      <Th>Total Students</Th>
                      <Th>Total Revenue</Th>
                      <Th>Commission Fee</Th>
                      <Th>Net Salary</Th>
                      <Th>Status</Th>
                      <Th textAlign="right">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((r, idx) => {
                      const revenue = getRevenue(r);
                      const commission = getCommission(r);
                      const rate = getRate(r);
                      const net = getNet(r);
                      const students = getStudentCount(r);
                      const isPaid = r.batchStatus === "paid";
                      const isNotGenerated = r.batchStatus === "not_generated";

                      return (
                        <Tr key={r.instructorId ?? r.instructor_id ?? idx}>
                          <Td>
                            <HStack spacing={3}>
                              <Avatar name={getName(r)} size="sm" />
                              <Box>
                                <Text fontWeight="medium">{getName(r)}</Text>
                                <Text fontSize="xs" color={muted}>
                                  {getEmail(r)}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>{students}</Td>
                          <Td>{money(revenue)}</Td>
                          <Td color="red.400" fontWeight="medium">
                            -{money(commission)}{" "}
                            <Text as="span" fontSize="xs" color={muted}>
                              ({Math.round(rate * 100)}%)
                            </Text>
                          </Td>
                          <Td fontWeight="bold">{money(net)}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                isPaid
                                  ? "green"
                                  : isNotGenerated
                                    ? "gray"
                                    : "yellow"
                              }
                              borderRadius="full"
                              px={2}
                            >
                              {isPaid
                                ? "Paid"
                                : isNotGenerated
                                  ? "Not Generated"
                                  : "Pending"}
                            </Badge>
                          </Td>
                          <Td textAlign="right">
                            {!isPaid && r.batchId ? (
                              <Button
                                size="sm"
                                bg="yellow.400"
                                _hover={{ bg: "yellow.500" }}
                                color="black"
                                leftIcon={<CheckCircleIcon />}
                                onClick={() => handleMarkPaid(r.batchId)}
                                isLoading={markingPaidId === r.batchId}
                                loadingText="Processing..."
                              >
                                Confirm Payment
                              </Button>
                            ) : isPaid ? (
                              <Button size="sm" variant="ghost" isDisabled>
                                Paid ✓
                              </Button>
                            ) : (
                              <Text fontSize="xs" color={muted}>
                                Generate payroll first
                              </Text>
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}

            {/* ── Pagination ── */}
            <Flex
              p={4}
              borderTopWidth="1px"
              borderColor={border}
              justify="space-between"
              align="center"
            >
              <Text fontSize="sm" color={muted}>
                Showing {filtered.length ? start + 1 : 0}-
                {Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} instructors
              </Text>
              <HStack>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<ChevronLeftIcon />}
                  isDisabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Text fontSize="sm" color={muted}>
                  {safePage} / {totalPages}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<ChevronRightIcon />}
                  isDisabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
