import React, { useState } from "react";
import { Card, Button, Space, Badge, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LabelTitle from "./LabelTitle";

interface LabelProps {
  label: { guid: string; title: string };
  onTicketUpdate: () => void;
}

const Label: React.FC<LabelProps> = ({ label, onTicketUpdate }) => {
  const [isAddTicketVisible, setIsAddTicketVisible] = useState(false);
  // Dummy tickets for design
  // FIXME: will remove with api data
  const tickets = [
    { guid: "t1", title: "Sample Ticket 1" },
    { guid: "t2", title: "Sample Ticket 2" },
  ];

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
          <Badge count={tickets.length} showZero />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="mb-2">No tickets</div>
            <div className="text-sm">Drop tickets here or add new ones</div>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.guid} className="bg-white rounded shadow p-2">
              {ticket.title}
            </div>
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
    </Card>
  );
};

export default Label;
