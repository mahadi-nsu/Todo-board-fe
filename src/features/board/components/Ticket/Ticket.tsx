import React from "react";
import { Card, Typography, Tag, Space } from "antd";

const { Text, Title } = Typography;

// TODO: Will move this when connecting with api's
export interface TicketData {
  guid: string;
  title: string;
  description: string;
  tags: string[];
}

interface TicketProps {
  ticket: TicketData;
}

const tagColors: Record<string, string> = {
  "Expires today": "orange",
  frontend: "blue",
  backend: "purple",
  high: "red",
  low: "green",
};

const Ticket: React.FC<TicketProps> = ({ ticket }) => {
  return (
    <Card
      className="mb-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      size="small"
      bodyStyle={{ padding: "12px" }}
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
        {ticket.tags.map((tag) => (
          <Tag key={tag} color={tagColors[tag] || "default"}>
            {tag}
          </Tag>
        ))}
      </Space>
    </Card>
  );
};

export default Ticket;
