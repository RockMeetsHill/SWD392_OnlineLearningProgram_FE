import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  HStack,
  VStack,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiDownload,
  FiChevronRight,
  FiDollarSign,
  FiUsers,
  FiMoreVertical,
  FiEye,
  FiFileText,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import {
  exportRevenue,
  getRevenueOrders,
  getRevenueSummary,
} from "../../services/admin/revenueService";

const PAGE_SIZE = 10;

const RevenueTracking = () => {
  const { token } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("this-month");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    revenueByPaymentMethod: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const tableBgHover = useColorModeValue("gray.50", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const getInstructorNames = (courses = []) => {
    const names = courses
      .map(
        (c) =>
          c.instructor?.fullName ||
          c.instructorName ||
          c.teacher?.fullName ||
          c.owner?.fullName ||
          "",
      )
      .filter(Boolean);

    return [...new Set(names)].join(", ");
  };

  const getDateRangeFromFilter = (filter) => {
    const now = new Date();
    let startDate = "";
    let endDate = now.toISOString();

    if (filter === "this-month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = start.toISOString();
    } else if (filter === "last-month") {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      startDate = start.toISOString();
      endDate = end.toISOString();
    } else if (filter === "last-quarter") {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 3);
      startDate = start.toISOString();
    } else if (filter === "this-year") {
      const start = new Date(now.getFullYear(), 0, 1);
      startDate = start.toISOString();
    }

    return { startDate, endDate };
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { startDate, endDate } = getDateRangeFromFilter(timeFilter);

      const [ordersRes, summaryRes] = await Promise.all([
        getRevenueOrders(
          {
            page: currentPage,
            limit: PAGE_SIZE,
            search: searchTerm || undefined,
            status: statusFilter || undefined,
            startDate,
            endDate,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
          token,
        ),
        getRevenueSummary({ startDate, endDate }, token),
      ]);

      setOrders(ordersRes?.data || []);
      setPagination(
        ordersRes?.pagination || {
          page: 1,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 1,
        },
      );
      setSummary(summaryRes || {});
    } catch (err) {
      setError(err.message || "Failed to load revenue data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // debounce search
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, timeFilter, statusFilter, token]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const { startDate, endDate } = getDateRangeFromFilter(timeFilter);
      const { blob, filename } = await exportRevenue(
        { type: "orders", startDate, endDate },
        token,
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const totalAmountInPage = useMemo(
    () => orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    [orders],
  );

  return (
    <Box minH="100vh" bg={bgColor}>
      <AdminNavbar />
      <Flex>
        <AdminSidebar />

        <Box
          ml={{ base: 0, md: "256px" }}
          w={{ base: "100%", md: "calc(100% - 256px)" }}
          p={{ base: 4, md: 6, lg: 8 }}
          minH="calc(100vh - 64px)"
        >
          <Box mb={8}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              gap={4}
            >
              <Box>
                <Heading as="h1" size="lg" color={textColor} mb={1}>
                  Revenue Tracking
                </Heading>
                <Text color={secondaryTextColor}>
                  Orders, payments and revenue summary.
                </Text>
              </Box>
              <HStack spacing={3}>
                <Button
                  leftIcon={<FiDownload />}
                  bg="primary.500"
                  color="gray.800"
                  _hover={{ bg: "primary.600" }}
                  fontWeight="semibold"
                  size="md"
                  isLoading={isExporting}
                  onClick={handleExport}
                >
                  Export CSV
                </Button>
              </HStack>
            </Flex>
          </Box>

          <Flex direction={{ base: "column", md: "row" }} gap={6} mb={8}>
            <Card
              flex={1}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <CardBody>
                <Flex align="center" gap={4}>
                  <Box p={3} bg="green.50" borderRadius="lg" color="green.500">
                    <Icon as={FiDollarSign} boxSize={7} />
                  </Box>
                  <Stat>
                    <StatLabel color={secondaryTextColor} fontWeight="medium">
                      Total Revenue
                    </StatLabel>
                    <StatNumber color={textColor} fontSize="2xl">
                      {formatCurrency(summary.totalRevenue)}
                    </StatNumber>
                  </Stat>
                </Flex>
              </CardBody>
            </Card>

            <Card
              flex={1}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <CardBody>
                <Flex align="center" gap={4}>
                  <Box p={3} bg="blue.50" borderRadius="lg" color="blue.500">
                    <Icon as={FiUsers} boxSize={7} />
                  </Box>
                  <Stat>
                    <StatLabel color={secondaryTextColor} fontWeight="medium">
                      Total Transactions
                    </StatLabel>
                    <StatNumber color={textColor} fontSize="2xl">
                      {(summary.totalTransactions || 0).toLocaleString()}
                    </StatNumber>
                  </Stat>
                </Flex>
              </CardBody>
            </Card>
          </Flex>

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            gap={4}
            mb={6}
          >
            <InputGroup maxW={{ base: "100%", md: "380px" }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by customer name/email..."
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
                }}
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
              />
            </InputGroup>

            <HStack spacing={3}>
              <Select
                value={timeFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setTimeFilter(e.target.value);
                }}
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                maxW="200px"
                icon={<FiCalendar />}
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="this-year">This Year</option>
              </Select>

              <Select
                value={statusFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setStatusFilter(e.target.value);
                }}
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                maxW="200px"
                icon={<FiFilter />}
              >
                <option value="">All Status</option>
                <option value="pending">pending</option>
                <option value="completed">completed</option>
                <option value="canceled">canceled</option>
                <option value="refunded">refunded</option>
              </Select>
            </HStack>
          </Flex>

          {error ? (
            <Card
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              p={4}
              mb={6}
            >
              <Text color="red.500">{error}</Text>
            </Card>
          ) : null}

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            {isLoading ? (
              <Flex py={16} justify="center">
                <Spinner />
              </Flex>
            ) : (
              <>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg={tableHeaderBg}>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Customer</Th>
                        <Th w="32%" minW="520px">Courses</Th>
                        <Th w="20%" minW="280px">Instructor</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Total Amount</Th>
                        <Th>Payment Method</Th>
                        <Th>Created At</Th>
                        <Th width="50px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orders.map((o) => (
                        <Tr
                          key={o.orderId}
                          _hover={{ bg: tableBgHover }}
                          transition="background 0.2s"
                        >
                          <Td fontWeight="semibold">#{o.orderId}</Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">
                                {o.user?.fullName || "-"}
                              </Text>
                              <Text fontSize="xs" color={secondaryTextColor}>
                                {o.user?.email || "-"}
                              </Text>
                            </VStack>
                          </Td>
                          <Td maxW="520px" minW="520px">
                            <Text noOfLines={1}>
                              {(o.courses || [])
                                .map((c) => c.title)
                                .join(", ") || "-"}
                            </Text>
                          </Td>
                          <Td maxW="300px">
                            <Text noOfLines={1}>
                              {getInstructorNames(o.courses) || "-"}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                o.status === "completed"
                                  ? "green"
                                  : o.status === "pending"
                                    ? "yellow"
                                    : "red"
                              }
                            >
                              {o.status}
                            </Badge>
                          </Td>
                          <Td isNumeric fontWeight="bold" color="green.500">
                            {formatCurrency(o.totalAmount)}
                          </Td>
                          <Td>{o.paymentMethod || "-"}</Td>
                          <Td>{new Date(o.createdAt).toLocaleString()}</Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                                aria-label="More options"
                              />
                              <MenuList>
                                <MenuItem icon={<FiEye />}>
                                  View Details
                                </MenuItem>
                                <MenuItem icon={<FiFileText />}>
                                  Generate Report
                                </MenuItem>
                                <MenuItem icon={<FiDownload />}>
                                  Export Data
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                <Flex
                  p={4}
                  borderTop="1px"
                  borderColor={borderColor}
                  bg={tableHeaderBg}
                  justify="space-between"
                  align="center"
                >
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Showing page {pagination.page} /{" "}
                    {Math.max(1, pagination.totalPages)} • {pagination.total}{" "}
                    results
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor={borderColor}
                      isDisabled={pagination.page <= 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor={borderColor}
                      isDisabled={pagination.page >= pagination.totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              </>
            )}
          </Card>

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            mt={6}
            p={6}
          >
            <Flex
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={3}
            >
              <VStack align="flex-start" spacing={1}>
                <Text fontWeight="semibold" color={textColor}>
                  Current Page Summary
                </Text>
                <Text fontSize="sm" color={secondaryTextColor}>
                  Based on current filters
                </Text>
              </VStack>
              <HStack spacing={8}>
                <VStack align="flex-end" spacing={0}>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Page Revenue
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    {formatCurrency(totalAmountInPage)}
                  </Text>
                </VStack>
                <VStack align="flex-end" spacing={0}>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Avg Order Value
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.500">
                    {formatCurrency(summary.averageOrderValue)}
                  </Text>
                </VStack>
              </HStack>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default RevenueTracking;
