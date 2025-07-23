import React, { useState, useRef } from "react";
import { Card, Button, Badge, Dropdown, message, Modal, Select } from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import CategoryTitle from "./CategoryTitle";
import { Ticket, AddNewTicket, TicketViewModal } from "../Ticket";
import type { TicketData } from "../Ticket/Ticket";
import {
  useGetTicketsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "@/store/services/ticketApi";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/store/services/categoryApi";
import toast from "react-hot-toast";

interface CategoryProps {
  label: { guid: string; title: string };
  onTicketUpdate: () => void;
}

const Category: React.FC<CategoryProps> = ({ label, onTicketUpdate }) => {
  const [isAddTicketVisible, setIsAddTicketVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedDestinationCategory, setSelectedDestinationCategory] =
    useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [draggedTicket, setDraggedTicket] = useState<TicketData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { data: allTickets, refetch: refetchTickets } = useGetTicketsQuery();
  const { data: categories, refetch: refetchCategories } =
    useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  // Filter tickets for this category
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
      toast.error("Please select a destination category for existing tickets");
      return;
    }

    // Check if the selected destination is the same as the current category
    if (selectedDestinationCategory === parseInt(label.guid)) {
      message.warning("Please select a different category as the destination");
      return;
    }

    try {
      console.log("Attempting to delete category:", parseInt(label.guid));
      console.log(
        "Selected destination category:",
        selectedDestinationCategory
      );
      console.log(
        "Selected destination category (string):",
        selectedDestinationCategory.toString()
      );

      const deleteParams = {
        id: label.guid,
        moveExistingTicketsToCategoryId: selectedDestinationCategory.toString(),
      };
      console.log("Delete parameters:", deleteParams);

      await deleteCategory(deleteParams).unwrap();
      message.success("Category deleted successfully!");
      setIsDeleteModalVisible(false);
      setSelectedDestinationCategory(null);

      // Small delay to ensure API has processed the deletion
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refresh ticket data to show moved tickets immediately
      await refetchTickets();
      await refetchCategories();
      onTicketUpdate();
    } catch (error) {
      console.error("Delete category error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "Failed to delete category";
      if (error && typeof error === "object") {
        if (
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
        ) {
          errorMessage = (error.data as { message: string }).message;
        } else if ("status" in error) {
          errorMessage = `HTTP ${error.status}: ${errorMessage}`;
        }
      }

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
      // message.success("Ticket updated successfully!");
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
      throw error;
    }
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalVisible(false);
    setSelectedTicket(null);
  };

  const handleLabelUpdate = async () => {
    // Just refetch tickets to get updated ticket label data without closing modal
    await refetchTickets();
    onTicketUpdate();
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) {
      return;
    }

    // Close the modal immediately to prevent getTicket query from running
    setIsTicketModalVisible(false);
    setSelectedTicket(null);

    try {
      const ticketId = selectedTicket.id;
      await deleteTicket(ticketId).unwrap();
      message.success("Ticket deleted successfully!");
      await refetchTickets(); // Refetch tickets to get updated data
      onTicketUpdate();
    } catch (error) {
      console.error("Delete ticket error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete ticket";
      message.error(errorMessage);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, ticket: TicketData) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ticket.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // Try to get ticket data from state or dataTransfer
    let ticketToMove = draggedTicket;

    if (!ticketToMove) {
      const ticketId = e.dataTransfer.getData("text/plain");

      if (ticketId) {
        // Find the ticket in all tickets and convert to TicketData format
        const foundTicket = allTickets?.find(
          (t) => t.id.toString() === ticketId
        );
        if (foundTicket) {
          ticketToMove = {
            id: foundTicket.id,
            title: foundTicket.title,
            description: foundTicket.description || "",
            expiresAt: foundTicket.expiresAt,
            categoryId: foundTicket.categoryId,
            createdAt: foundTicket.createdAt,
            updatedAt: foundTicket.updatedAt,
            labels: foundTicket.labels,
            category: foundTicket.category,
            history: foundTicket.history,
          };
        }
      }
    }

    if (!ticketToMove) {
      return;
    }

    const targetCategoryId = parseInt(label.guid);

    // Don't drop if it's the same category
    if (ticketToMove.categoryId === targetCategoryId) {
      message.info("Ticket is already in this category");
      setDraggedTicket(null);
      return;
    }

    try {
      // Update the ticket's category
      const updateData = {
        id: ticketToMove.id,
        categoryId: targetCategoryId,
        title: ticketToMove.title,
        description: ticketToMove.description,
        expiresAt: ticketToMove.expiresAt,
      };

      await updateTicket(updateData).unwrap();

      message.success(`Ticket moved to "${label.title}"`);
      await refetchTickets();
      onTicketUpdate();
    } catch (error) {
      console.error("Move ticket error:", error);
      let errorMessage = "Failed to move ticket";
      if (error && typeof error === "object") {
        // If backend returns an array of errors (like your example)
        if (
          Array.isArray((error as any)?.data) &&
          (error as any)?.data[0]?.message
        ) {
          errorMessage = (error as any).data[0].message;
        } else if ((error as any)?.data?.error?.message) {
          errorMessage = (error as any).data.error.message;
        } else if ((error as any)?.data?.message) {
          errorMessage = (error as any).data.message;
        }
      }
      if (errorMessage === "Validation failed") {
        toast.error(
          "This card is expired. To move it, please extend the expiry date."
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setDraggedTicket(null);
    }
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
    setDraggedTicket(null);
  };

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Category",
      onClick: handleEditCategory,
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Category",
      danger: true,
      onClick: handleDeleteCategory,
    },
  ];

  return (
    <Card
      id={`category-${label.guid}`}
      className="h-full min-h-[400px] sm:min-h-[500px] flex flex-col"
      bodyStyle={{
        padding: "8px sm:12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Category Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <CategoryTitle
            label={label}
            onSuccess={() => setIsEditingTitle(false)}
            onCancel={() => setIsEditingTitle(false)}
            forceEdit={isEditingTitle}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge count={ticketData.length} showZero size="small" />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </div>
      </div>

      {/* Tickets List */}
      <div
        ref={dropZoneRef}
        className={`flex-1 overflow-y-auto mb-4 transition-colors duration-200 ${
          isDragOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
        }`}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {tickets.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <div className="mb-2 text-sm sm:text-base">No tickets</div>
            <div className="text-xs sm:text-sm">
              {isDragOver
                ? "Drop here to move ticket"
                : "Drop tickets here or add new ones"}
            </div>
          </div>
        ) : (
          <>
            {isDragOver && (
              <div className="text-center py-2 text-blue-600 text-sm font-medium">
                Drop here to move ticket
              </div>
            )}
            {ticketData.map((ticket) => (
              <Ticket
                key={ticket.id}
                ticket={ticket}
                onClick={handleTicketClick}
                onDragStart={(e) => handleDragStart(e, ticket)}
                isDragging={draggedTicket?.id === ticket.id}
              />
            ))}
          </>
        )}
      </div>

      {/* Add Ticket Button */}
      <div className="mt-auto">
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          className="w-full"
          size="middle"
          onClick={() => setIsAddTicketVisible(true)}
        >
          <span className="hidden sm:inline">Add Ticket</span>
          <span className="sm:hidden">Add</span>
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
        onLabelUpdate={handleLabelUpdate}
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

export default Category;
