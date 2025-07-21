import React, { useState } from "react";
import { Card, Button, Space, Badge, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LabelTitle from "./LabelTitle";
import Ticket from "../Ticket/Ticket";
import type { TicketData } from "../Ticket/Ticket";
import AddNewTicket from "../Ticket/AddNewTicket";
import { useGetTicketsQuery } from "@/store/services/ticketApi";

interface LabelProps {
  label: { guid: string; title: string };
  onTicketUpdate: () => void;
}

const Label: React.FC<LabelProps> = ({ label, onTicketUpdate }) => {
  const [isAddTicketVisible, setIsAddTicketVisible] = useState(false);
  const { data: allTickets, isLoading } = useGetTicketsQuery();

  // Filter tickets for this category (label)
  const categoryId = parseInt(label.guid);
  const tickets =
    allTickets?.filter((ticket) => ticket.categoryId === categoryId) || [];

  // Convert API tickets to TicketData format
  const ticketData: TicketData[] = tickets.map((ticket) => ({
    guid: ticket.id.toString(),
    title: ticket.title,
    description: ticket.description || "No description",
    tags: [], // We'll add tags later when we implement label fetching
  }));

  const menuItems = [
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Label",
      danger: true,
      onClick: () => {
        // No-op for demo
      },
    },
  ];

  return (
    <Card
      id={`label-${label.guid}`}
      className="h-full min-h-[500px] flex flex-col"
      bodyStyle={{
        padding: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Label Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <LabelTitle label={label} onSuccess={() => {}} onCancel={() => {}} />
        </div>
        <Space>
          <Badge count={ticketData.length} showZero />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      </div>

      {/* Tickets List */}
      <div
        className="flex-1 overflow-y-auto mb-4"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="mb-2">No tickets</div>
            <div className="text-sm">Drop tickets here or add new ones</div>
          </div>
        ) : (
          ticketData.map((ticket) => (
            <Ticket key={ticket.guid} ticket={ticket} />
          ))
        )}
      </div>

      {/* Add Ticket Button */}
      <div className="mt-auto">
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          className="w-full"
          size="small"
          onClick={() => setIsAddTicketVisible(true)}
        >
          Add Ticket
        </Button>
      </div>

      {/* Add New Ticket Modal */}
      <AddNewTicket
        visible={isAddTicketVisible}
        labelTitle={label.title}
        onSuccess={() => setIsAddTicketVisible(false)}
        onCancel={() => setIsAddTicketVisible(false)}
      />
    </Card>
  );
};

export default Label;
