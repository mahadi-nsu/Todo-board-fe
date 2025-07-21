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
import TicketViewModal from "../Ticket/TicketViewModal";
import {
  useGetTicketsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "@/store/services/ticketApi";
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
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const { data: allTickets, refetch: refetchTickets } = useGetTicketsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  // Filter tickets for this category (label)
  const categoryId = parseInt(label.guid);
  const tickets =
    allTickets?.filter((ticket) => ticket.categoryId === categoryId) || [];

  // Convert API tickets to TicketData format
  const ticketData: TicketData[] = tickets.map((ticket) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description || "No description",
    expiresAt: ticket.expiresAt,
    categoryId: ticket.categoryId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    labels: ticket.labels,
    category: ticket.category,
    history: ticket.history,
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
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete category";
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

  const handleTicketClick = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsTicketModalVisible(true);
  };

  const handleTicketUpdate = async (updatedTicket: Partial<TicketData>) => {
    if (!selectedTicket) return;

    try {
      const ticketId = selectedTicket.id;
      const updateData: {
        id: number;
        title?: string;
        description?: string;
        expiresAt?: string;
        categoryId?: number;
      } = {
        id: ticketId,
      };

      if (updatedTicket.title) updateData.title = updatedTicket.title;
      if (updatedTicket.description)
        updateData.description = updatedTicket.description;
      if (updatedTicket.expiresAt)
        updateData.expiresAt = updatedTicket.expiresAt;

      // Always include categoryId as it's required by the API
      updateData.categoryId = selectedTicket.categoryId || parseInt(label.guid);

      await updateTicket(updateData).unwrap();
      message.success("Ticket updated successfully!");
      await refetchTickets(); // Refetch tickets to get updated data
      setIsTicketModalVisible(false); // Close the modal
      setSelectedTicket(null); // Clear selected ticket
      onTicketUpdate();
    } catch (error) {
      console.error("Update ticket error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update ticket";
      message.error(errorMessage);
    }
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalVisible(false);
    setSelectedTicket(null);
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;

    try {
      const ticketId = selectedTicket.id;
      await deleteTicket(ticketId).unwrap();
      message.success("Ticket deleted successfully!");
      await refetchTickets(); // Refetch tickets to get updated data
      setIsTicketModalVisible(false);
      setSelectedTicket(null);
      onTicketUpdate();
    } catch (error) {
      console.error("Delete ticket error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete ticket";
      message.error(errorMessage);
    }
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
            <Ticket
              key={ticket.id}
              ticket={ticket}
              onClick={handleTicketClick}
            />
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

      {/* Ticket View Modal */}
      <TicketViewModal
        visible={isTicketModalVisible}
        ticket={selectedTicket}
        onClose={handleCloseTicketModal}
        onUpdate={handleTicketUpdate}
        onDelete={handleDeleteTicket}
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
