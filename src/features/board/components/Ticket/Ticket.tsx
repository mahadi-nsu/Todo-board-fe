import React from "react";
import { Card, Typography, Tag, Space } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

// TODO: Will move this when connecting with api's
export interface TicketData {
  id: number;
  title: string;
  description: string;
  expiresAt?: string;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
  labels?: Array<{
    label: {
      id: number;
      title: string;
    };
  }>;
  category?: {
    id: number;
    title: string;
  };
  history?: Array<{
    createdAt: string;
    category: {
      id: number;
      title: string;
    };
  }>;
}

interface TicketProps {
  ticket: TicketData;
  onClick?: (ticket: TicketData) => void;
  onDragStart?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

const tagColors: Record<string, string> = {
  "Expires today": "orange",
  frontend: "blue",
  backend: "purple",
  high: "red",
  low: "green",
};

const Ticket: React.FC<TicketProps> = ({
  ticket,
  onClick,
  onDragStart,
  isDragging,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(ticket);
    }
  };

  // Expiry logic
  let expiryStatus: "expired" | "expiring-soon" | null = null;
  let expiryText = "";
  let expiryColor = "";
  if (ticket.expiresAt) {
    const now = dayjs();
    const expires = dayjs(ticket.expiresAt);
    if (expires.isBefore(now, "minute")) {
      expiryStatus = "expired";
      expiryText = "Expired";
      expiryColor = "red";
    } else if (expires.diff(now, "hour") < 24) {
      expiryStatus = "expiring-soon";
      expiryText = "Expiring Soon";
      expiryColor = "orange";
    }
  }

  return (
    <Card
      className={`mb-6 cursor-grab hover:shadow-md transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95 cursor-grabbing" : ""
      }`}
      size="small"
      bodyStyle={{ padding: "12px" }}
      onClick={handleClick}
      draggable={true}
      onDragStart={onDragStart}
      style={{
        width: "100%",
        position: "relative",
        ...(expiryStatus ? { border: `2px solid ${expiryColor}` } : {}),
      }}
      headStyle={
        expiryStatus ? { borderBottom: `2px solid ${expiryColor}` } : undefined
      }
    >
      <div style={{ position: "relative", minHeight: 32 }}>
        {expiryStatus && (
          <Tag
            color={expiryColor}
            style={{
              fontWeight: 600,
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            {expiryText}
          </Tag>
        )}
        <Title
          level={5}
          className="mb-2 text-gray-800 truncate"
          style={{ marginBottom: 0 }}
        >
          {ticket.title}
        </Title>
      </div>
      <Text
        type="secondary"
        className="text-sm line-clamp-2 mb-3 block"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {ticket.description}
      </Text>
      <Space size="small">
        {ticket.labels?.map((labelItem) => (
          <Tag
            key={labelItem.label.id}
            color={tagColors[labelItem.label.title] || "default"}
          >
            {labelItem.label.title}
          </Tag>
        ))}
      </Space>
    </Card>
  );
};

export default Ticket;
