import React, { useState, useRef } from "react";
import { Card, Button, Badge, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import CategoryTitle from "./CategoryTitle";
import { Ticket, AddNewTicket, TicketViewModal } from "../Ticket";
import type { TicketData } from "../../types/ticketTypes";
import type { CategoryProps } from "../../types/categoryTypes";
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
import {
  convertToTicketData,
  extractApiErrorMessage,
  findTicketById,
} from "../../utils/categoryUtils";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { getCategoryMenuItems } from "./categoryMenuItems";

const Category: React.FC<CategoryProps> = ({ label, onTicketUpdate }) => {
  // Local States
  const [isAddTicketVisible, setIsAddTicketVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedDestinationCategory, setSelectedDestinationCategory] =
    useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [draggedTicket, setDraggedTicket] = useState<TicketData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // DOM state
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // API Queries
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
  const ticketData: TicketData[] = tickets.map(convertToTicketData);

  // Handlers
  const handleDeleteCategory = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDestinationCategory === parseInt(label.guid)) {
      toast.error("Please select a different category as the destination");
      return;
    }
    try {
      const deleteParams = {
        id: label.guid,
        ...(selectedDestinationCategory
          ? {
              moveExistingTicketsToCategoryId:
                selectedDestinationCategory.toString(),
            }
          : {}),
      };
      await deleteCategory(deleteParams).unwrap();
      toast.success("Category deleted successfully!");
      setIsDeleteModalVisible(false);
      setSelectedDestinationCategory(null);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refetchTickets();
      await refetchCategories();
      onTicketUpdate();
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      if (errorMessage) {
        toast.error(errorMessage);
      }
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

      updateData.categoryId = selectedTicket.categoryId || parseInt(label.guid);
      await updateTicket(updateData).unwrap();
      await refetchTickets();
      setIsTicketModalVisible(false);
      setSelectedTicket(null);
      onTicketUpdate();
    } catch (error) {
      const errorMessage =
        extractApiErrorMessage(error) || "Failed to update ticket";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalVisible(false);
    setSelectedTicket(null);
  };

  const handleLabelUpdate = async () => {
    await refetchTickets();
    onTicketUpdate();
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) {
      return;
    }
    setIsTicketModalVisible(false);
    setSelectedTicket(null);

    try {
      const ticketId = selectedTicket.id;
      await deleteTicket(ticketId).unwrap();
      toast.success("Ticket deleted successfully!");
      await refetchTickets();
      onTicketUpdate();
    } catch (error) {
      const errorMessage =
        extractApiErrorMessage(error) || "Failed to delete ticket";
      toast.error(errorMessage);
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
    let ticketToMove = draggedTicket;
    if (!ticketToMove) {
      const ticketId = e.dataTransfer.getData("text/plain");
      if (ticketId) {
        ticketToMove = findTicketById(allTickets, ticketId) || null;
      }
    }
    if (!ticketToMove) {
      return;
    }
    const targetCategoryId = parseInt(label.guid);
    if (ticketToMove.categoryId === targetCategoryId) {
      toast.error("Ticket is already in this category");
      setDraggedTicket(null);
      return;
    }
    try {
      const updateData = {
        id: ticketToMove.id,
        categoryId: targetCategoryId,
        title: ticketToMove.title,
        description: ticketToMove.description,
        expiresAt: ticketToMove.expiresAt,
      };
      await updateTicket(updateData).unwrap();
      toast.success(`Ticket moved to "${label.title}"`);
      await refetchTickets();
      onTicketUpdate();
    } catch (error) {
      const errorMessage =
        extractApiErrorMessage(error) || "Failed to move ticket";
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

  // Menu Items for the category
  const menuItems = getCategoryMenuItems(
    handleEditCategory,
    handleDeleteCategory
  );

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
      <DeleteCategoryModal
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLoading={isDeleting}
        categories={categories || []}
        currentCategoryId={parseInt(label.guid)}
        selectedDestinationCategory={selectedDestinationCategory}
        setSelectedDestinationCategory={setSelectedDestinationCategory}
        labelTitle={label.title}
      />
    </Card>
  );
};

export default Category;
