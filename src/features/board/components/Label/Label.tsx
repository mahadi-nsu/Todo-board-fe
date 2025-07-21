import React, { useState } from "react";
import {
  Card,
  Button,
  Space,
  Badge,
  Dropdown,
  message,
  Modal,
  Select,
} from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import LabelTitle from "./LabelTitle";
import Ticket from "../Ticket/Ticket";
import type { TicketData } from "../Ticket/Ticket";
import AddNewTicket from "../Ticket/AddNewTicket";
import { useGetTicketsQuery } from "@/store/services/ticketApi";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/store/services/categoryApi";

interface LabelProps {
  label: { guid: string; title: string };
  onTicketUpdate: () => void;
}

const Label: React.FC<LabelProps> = ({ label, onTicketUpdate }) => {
  const [isAddTicketVisible, setIsAddTicketVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedDestinationCategory, setSelectedDestinationCategory] =
    useState<number | null>(null);
  const { data: allTickets } = useGetTicketsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

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

  const handleDeleteCategory = () => {
    console.log("Delete category clicked for:", label.title, "ID:", label.guid);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDestinationCategory) {
      message.warning(
        "Please select a destination category for existing tickets"
      );
      return;
    }

    try {
      console.log("Attempting to delete category:", parseInt(label.guid));
      await deleteCategory({
        id: parseInt(label.guid),
        moveExistingTicketsToCategoryId: selectedDestinationCategory,
      }).unwrap();
      message.success("Category deleted successfully!");
      setIsDeleteModalVisible(false);
      setSelectedDestinationCategory(null);
    } catch (error) {
      console.error("Delete category error:", error);
      const errorMessage =
        (error as any)?.data?.message || "Failed to delete category";
      message.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedDestinationCategory(null);
  };

  const handleEditCategory = () => {
    setIsEditingTitle(true);
  };

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Label",
      onClick: handleEditCategory,
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Label",
      danger: true,
      onClick: handleDeleteCategory,
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
          <LabelTitle
            label={label}
            onSuccess={() => setIsEditingTitle(false)}
            onCancel={() => setIsEditingTitle(false)}
            forceEdit={isEditingTitle}
          />
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
        categoryId={parseInt(label.guid)}
        onSuccess={() => setIsAddTicketVisible(false)}
        onCancel={() => setIsAddTicketVisible(false)}
      />

      {/* Delete Category Modal */}
      <Modal
        title="Delete Category"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        confirmLoading={isDeleting}
      >
        <div style={{ marginBottom: "16px" }}>
          <p>
            Are you sure you want to delete <strong>"{label.title}"</strong>?
          </p>
          <p style={{ marginTop: "8px", color: "#666" }}>
            All tickets in this category will be moved to the selected
            destination category.
          </p>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Move existing tickets to:
          </label>
          <Select
            placeholder="Select destination category"
            style={{ width: "100%" }}
            value={selectedDestinationCategory}
            onChange={setSelectedDestinationCategory}
            options={
              categories
                ?.filter((cat) => cat.id !== parseInt(label.guid))
                .map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                })) || []
            }
          />
        </div>
      </Modal>
    </Card>
  );
};

export default Label;
