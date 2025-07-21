import React from "react";
import { Card, Typography, Tag, Space } from "antd";

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
}

const tagColors: Record<string, string> = {
  "Expires today": "orange",
  frontend: "blue",
  backend: "purple",
  high: "red",
  low: "green",
};

const Ticket: React.FC<TicketProps> = ({ ticket, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(ticket);
    }
  };

  return (
    <Card
      className="mb-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      size="small"
      bodyStyle={{ padding: "12px" }}
      onClick={handleClick}
    >
      <Title level={5} className="mb-2 text-gray-800 truncate">
        {ticket.title}
      </Title>
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
