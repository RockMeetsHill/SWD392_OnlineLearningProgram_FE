import { Badge } from "@chakra-ui/react";

/**
 * CourseStatusBadge Component
 * Displays course status with color-coded badges
 * 
 * @param {string} status - Course status (draft, pending_review, approved_upload, published, rejected)
 * @param {object} props - Additional Chakra UI Badge props
 */
const CourseStatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    draft: {
      label: "Bản nháp",
      colorScheme: "gray",
      bg: "gray.100",
      color: "gray.700",
    },
    pending_review: {
      label: "Chờ duyệt",
      colorScheme: "orange",
      bg: "orange.100",
      color: "orange.700",
    },
    approved_upload: {
      label: "Đã duyệt",
      colorScheme: "blue",
      bg: "blue.100",
      color: "blue.700",
    },
    published: {
      label: "Đã xuất bản",
      colorScheme: "green",
      bg: "green.100",
      color: "green.700",
    },
    rejected: {
      label: "Từ chối",
      colorScheme: "red",
      bg: "red.100",
      color: "red.700",
    },
    archived: {
      label: "Đã lưu trữ",
      colorScheme: "gray",
      bg: "gray.200",
      color: "gray.600",
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge
      colorScheme={config.colorScheme}
      bg={config.bg}
      color={config.color}
      px={3}
      py={1}
      borderRadius="full"
      fontSize="sm"
      fontWeight="semibold"
      {...props}
    >
      {config.label}
    </Badge>
  );
};

export default CourseStatusBadge;
