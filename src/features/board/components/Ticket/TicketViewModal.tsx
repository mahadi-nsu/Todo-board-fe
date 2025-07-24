import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  Tag,
  Select,
  Divider,
  Timeline,
  Popconfirm,
  Card,
  Descriptions,
  Dropdown,
} from "antd";
import toast from "react-hot-toast";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  TagOutlined,
  FolderOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  useGetTicketQuery,
  useAddLabelToTicketMutation,
  useRemoveLabelFromTicketMutation,
  useUpdateTicketMutation,
} from "@/store/services/ticketApi";
import { useGetLabelsQuery } from "@/store/services/labelApi";
import { useGetCategoriesQuery } from "@/store/services/categoryApi";
import type { TicketData } from "../../types/ticketTypes";
import RenderDetailsTab from "./RenderDetailsTab";
import RenderHistoryTab from "./RenderHistoryTab";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface TicketViewModalProps {
  visible: boolean;
  ticket: TicketData | null;
  onClose: () => void;
  onUpdate: (updatedTicket: Partial<TicketData>) => void;
  onDelete?: () => void;
  onLabelUpdate?: () => void;
}

const TicketViewModal: React.FC<TicketViewModalProps> = ({
  visible,
  ticket,
  onClose,
  onUpdate,
  onDelete,
  onLabelUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [form] = Form.useForm();
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
  const [localTicket, setLocalTicket] = useState<TicketData | null>(null);
  const {
    data: ticketData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useGetTicketQuery(ticket?.id || 0, {
    skip: !ticket?.id,
  });
  const { data: availableLabels } = useGetLabelsQuery();
  const { data: availableCategories } = useGetCategoriesQuery();
  const [addLabelToTicket] = useAddLabelToTicketMutation();
  const [removeLabelFromTicket] = useRemoveLabelFromTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();

  // Sync local ticket state with prop
  useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  // Draft key for localStorage
  const draftKey = ticket ? `ticket-draft-${ticket.id}` : null;

  // Load draft from localStorage when editing starts
  useEffect(() => {
    if (isEditing && draftKey && ticket) {
      const draft = localStorage.getItem(draftKey);
      form.setFieldsValue({
        title: ticket.title,
        description: draft ?? ticket.description,
        expiresAt: ticket.expiresAt ? dayjs(ticket.expiresAt) : null,
      });
    }
  }, [isEditing, draftKey, form, ticket]);

  // Save draft to localStorage on description change
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (draftKey) {
      localStorage.setItem(draftKey, e.target.value);
    }
  };

  // Remove draft from localStorage
  const clearDraft = () => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab("details"); // Switch to details tab when editing
    // Populate form with current ticket data
    if (ticket) {
      form.setFieldsValue({
        title: ticket.title,
        description: ticket.description,
        expiresAt: ticket.expiresAt ? dayjs(ticket.expiresAt) : null,
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Set the expiration date to the end of the selected day (23:59:59)
      let expiresAt: string | null = null;
      if (values.expiresAt) {
        const selectedDate = values.expiresAt;
        const isToday = selectedDate.isSame(dayjs(), "day");

        if (isToday) {
          // If today is selected, set to end of day (23:59:59)
          expiresAt = selectedDate.endOf("day").toISOString();
        } else {
          // For future dates, set to end of day (23:59:59)
          expiresAt = selectedDate.endOf("day").toISOString();
        }
      }

      const updatedTicket = {
        ...ticket,
        ...values,
        expiresAt: expiresAt,
      };

      await onUpdate(updatedTicket);
      setIsEditing(false);
      toast.success("Ticket updated successfully!");
    } catch (error) {
      console.error("Form validation error:", error);
      // Don't close editing mode on error so user can see the error and fix it
      // The error message will be shown by the parent component (Category.tsx)
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleMoveTicket = async (targetCategoryId: number) => {
    if (!localTicket) return;

    try {
      await updateTicket({
        id: localTicket.id,
        categoryId: targetCategoryId,
      }).unwrap();

      toast.success("Ticket moved successfully!");
      onClose(); // Close the modal after successful movement
    } catch (error) {
      console.error("Move ticket error:", error);
      let errorMessage = "Failed to move ticket";

      if (error && typeof error === "object") {
        const errorData = (error as { data?: { message?: string } }).data;
        const errorStatus = (error as { status?: number }).status;
        const errorMessageProp = (error as { message?: string }).message;

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorStatus) {
          errorMessage = `Server error: ${errorStatus}`;
        } else if (errorMessageProp) {
          errorMessage = errorMessageProp;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleAddLabels = async () => {
    if (selectedLabelIds.length === 0 || !localTicket) return;

    // Store original state for rollback
    const originalTicket = { ...localTicket };
    const labelsToAdd = selectedLabelIds;

    try {
      // Optimistic update - update UI immediately
      if (localTicket && availableLabels) {
        const addedLabels = availableLabels.filter((label) =>
          labelsToAdd.includes(label.id)
        );
        const newLabels = addedLabels.map((label) => ({
          label: { id: label.id, title: label.title },
        }));

        setLocalTicket({
          ...localTicket,
          labels: [...(localTicket.labels || []), ...newLabels],
        });
      }

      // API calls
      for (const labelId of labelsToAdd) {
        await addLabelToTicket({
          ticketId: localTicket.id,
          labelId: labelId,
        }).unwrap();
      }

      setSelectedLabelIds([]);

      // Trigger parent update to refresh ticket data
      if (onLabelUpdate) {
        onLabelUpdate();
      }
    } catch (error) {
      console.error("Add labels error:", error);

      // Rollback to original state on error
      setLocalTicket(originalTicket);

      // Enhanced error handling with better debugging
      let errorMessage = "Failed to add labels";

      if (error && typeof error === "object") {
        console.log("Error object:", error);
        console.log(
          "Error data:",
          (error as { data?: { message?: string } }).data
        );
        console.log("Error status:", (error as { status?: number }).status);

        const errorData = (error as { data?: { message?: string } }).data;
        const errorStatus = (error as { status?: number }).status;
        const errorMessageProp = (error as { message?: string }).message;

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorStatus) {
          errorMessage = `Server error: ${errorStatus}`;
        } else if (errorMessageProp) {
          errorMessage = errorMessageProp;
        }
      }

      console.log("Showing error message:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRemoveLabel = async (labelId: number) => {
    if (!localTicket) return;

    // Store original state for rollback
    const originalTicket = { ...localTicket };

    try {
      // Optimistic update - update UI immediately
      if (localTicket) {
        setLocalTicket({
          ...localTicket,
          labels:
            localTicket.labels?.filter(
              (labelItem) => labelItem.label.id !== labelId
            ) || [],
        });
      }

      // API call
      await removeLabelFromTicket({
        ticketId: localTicket.id,
        labelId: labelId,
      }).unwrap();

      // Trigger parent update to refresh ticket data
      if (onLabelUpdate) {
        onLabelUpdate();
      }
    } catch (error) {
      console.error("Remove label error:", error);

      // Rollback to original state on error
      setLocalTicket(originalTicket);

      // Enhanced error handling with better debugging
      let errorMessage = "Failed to remove label";

      if (error && typeof error === "object") {
        console.log("Remove label error object:", error);
        console.log(
          "Remove label error data:",
          (error as { data?: { message?: string } }).data
        );
        console.log(
          "Remove label error status:",
          (error as { status?: number }).status
        );

        const errorData = (error as { data?: { message?: string } }).data;
        const errorStatus = (error as { status?: number }).status;
        const errorMessageProp = (error as { message?: string }).message;

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorStatus) {
          errorMessage = `Server error: ${errorStatus}`;
        } else if (errorMessageProp) {
          errorMessage = errorMessageProp;
        }
      }

      console.log("Showing remove label error message:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "24px", // Add padding to avoid overlap with close button
          }}
        >
          <span>Ticket Details</span>
          {!isEditing && (
            <Space size="small">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={handleEdit}
                className="modal-action-btn"
              >
                <span className="btn-text">Edit</span>
              </Button>
              <Dropdown
                menu={{
                  items:
                    availableCategories
                      ?.filter(
                        (category) => category.id !== localTicket?.categoryId
                      )
                      .map((category) => ({
                        key: category.id,
                        label: category.title,
                        onClick: () => handleMoveTicket(category.id),
                      })) || [],
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<SwapOutlined />}
                  className="modal-action-btn"
                >
                  <span className="btn-text">MoveTo</span>
                </Button>
              </Dropdown>
              {onDelete && (
                <Popconfirm
                  title="Are you sure you want to delete this ticket?"
                  onConfirm={() => {
                    onDelete();
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className="modal-action-btn"
                  >
                    <span className="btn-text">Delete</span>
                  </Button>
                </Popconfirm>
              )}
            </Space>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        isEditing ? (
          <Space>
            <Button onClick={handleCancel} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} icon={<SaveOutlined />}>
              Save Changes
            </Button>
          </Space>
        ) : null
      }
      width={900}
    >
      <Tabs
        defaultActiveKey="details"
        activeKey={activeTab}
        onChange={setActiveTab}
      >
        <TabPane tab="Details" key="details">
          <RenderDetailsTab
            isEditing={isEditing}
            form={form}
            ticket={ticket}
            localTicket={localTicket}
            selectedLabelIds={selectedLabelIds}
            setSelectedLabelIds={setSelectedLabelIds}
            availableLabels={availableLabels}
            availableCategories={availableCategories}
            handleRemoveLabel={handleRemoveLabel}
            handleAddLabels={handleAddLabels}
            handleDescriptionChange={handleDescriptionChange}
          />
        </TabPane>
        <TabPane tab="History" key="history">
          <RenderHistoryTab
            isLoadingHistory={isLoadingHistory}
            historyError={historyError}
            ticketData={ticketData}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default TicketViewModal;
