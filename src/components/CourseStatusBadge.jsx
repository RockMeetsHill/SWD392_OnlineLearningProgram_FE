import { Badge } from "@chakra-ui/react";
import PropTypes from "prop-types";

/**
 * CourseStatusBadge Component
 * Displays course status with color-coded badges
 *
 * @param {string} status - Course status or visibility state
 * @param {object} props - Additional Chakra UI Badge props
 */
const CourseStatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    in_progress: {
      label: "In Progress",
      colorScheme: "gray",
      bg: "gray.100",
      color: "gray.700",
    },
    draft: {
      label: "Draft",
      colorScheme: "gray",
      bg: "gray.100",
      color: "gray.700",
    },
    pending_review: {
      label: "Pending Review",
      colorScheme: "orange",
      bg: "orange.100",
      color: "orange.700",
    },
    approved_upload: {
      label: "Approved",
      colorScheme: "blue",
      bg: "blue.100",
      color: "blue.700",
    },
    published: {
      label: "Published",
      colorScheme: "green",
      bg: "green.100",
      color: "green.700",
    },
    rejected: {
      label: "Rejected",
      colorScheme: "red",
      bg: "red.100",
      color: "red.700",
    },
    archived: {
      label: "Archived",
      colorScheme: "gray",
      bg: "gray.200",
      color: "gray.600",
    },
    flagged: {
      label: "Flagged",
      colorScheme: "red",
      bg: "red.100",
      color: "red.700",
    },
  };

  const config = statusConfig[status] || {
    label: status || "Unknown",
    colorScheme: "gray",
    bg: "gray.100",
    color: "gray.700",
  };

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

CourseStatusBadge.propTypes = {
  status: PropTypes.string,
};

export default CourseStatusBadge;
