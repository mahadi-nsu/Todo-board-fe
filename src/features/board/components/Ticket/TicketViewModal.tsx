import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  List,
  Tag,
  Select,
  Divider,
} from "antd";
import toast from "react-hot-toast";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { TicketData } from "./Ticket";
import {
  useGetTicketHistoryQuery,
  useAddLabelToTicketMutation,
  useRemoveLabelFromTicketMutation,
} from "@/store/services/ticketApi";
import { useGetLabelsQuery } from "@/store/services/labelApi";

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
  const [form] = Form.useForm();
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
  const [localTicket, setLocalTicket] = useState<TicketData | null>(null);
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useGetTicketHistoryQuery();
  const { data: availableLabels } = useGetLabelsQuery();
  const [addLabelToTicket] = useAddLabelToTicketMutation();
  const [removeLabelFromTicket] = useRemoveLabelFromTicketMutation();

  // Sync local ticket state with prop
  useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  const handleEdit = () => {
    setIsEditing(true);
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
      const updatedTicket = {
        ...ticket,
        ...values,
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
      };

      await onUpdate(updatedTicket);
      setIsEditing(false);
      toast.success("Ticket updated successfully!");
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
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

  const renderDetailsTab = () => (
    <div style={{ padding: "16px 0" }}>
      {isEditing ? (
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter ticket title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} placeholder="Enter ticket description" />
          </Form.Item>

          <Form.Item name="expiresAt" label="Expires At">
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <div style={{ marginBottom: "16px" }}>
            <strong>Title:</strong>
            <div style={{ marginTop: "4px" }}>{localTicket?.title}</div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Description:</strong>
            <div style={{ marginTop: "4px" }}>{localTicket?.description}</div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Expires At:</strong>
            <div style={{ marginTop: "4px" }}>
              {localTicket?.expiresAt
                ? dayjs(localTicket.expiresAt).format("YYYY-MM-DD HH:mm")
                : "Not set"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Category:</strong>
            <div style={{ marginTop: "4px" }}>
              {localTicket?.category?.title || "Not assigned"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Labels:</strong>
            <div style={{ marginTop: "4px" }}>
              {localTicket?.labels && localTicket.labels.length > 0 ? (
                <Space size="small">
                  {localTicket.labels.map((labelItem) => (
                    <Tag
                      key={labelItem.label.id}
                      color="blue"
                      closable
                      onClose={() => handleRemoveLabel(labelItem.label.id)}
                    >
                      {labelItem.label.title}
                    </Tag>
                  ))}
                </Space>
              ) : (
                "No labels"
              )}
            </div>

            {/* Add Label Section */}
            <Divider style={{ margin: "16px 0 8px 0" }} />
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Select
                mode="multiple"
                placeholder="Select labels to add"
                style={{ flex: 1 }}
                value={selectedLabelIds}
                onChange={setSelectedLabelIds}
                options={
                  availableLabels
                    ?.filter(
                      (label) =>
                        !localTicket?.labels?.some(
                          (ticketLabel) => ticketLabel.label.id === label.id
                        )
                    )
                    .map((label) => ({
                      label: label.title,
                      value: label.id,
                    })) || []
                }
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddLabels}
                disabled={selectedLabelIds.length === 0}
                size="small"
              >
                Add
              </Button>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Created:</strong>
            <div style={{ marginTop: "4px" }}>
              {localTicket?.createdAt
                ? dayjs(localTicket.createdAt).format("YYYY-MM-DD HH:mm")
                : "N/A"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Last Updated:</strong>
            <div style={{ marginTop: "4px" }}>
              {localTicket?.updatedAt
                ? dayjs(localTicket.updatedAt).format("YYYY-MM-DD HH:mm")
                : "N/A"}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => {
    if (isLoadingHistory) {
      return (
        <div style={{ padding: "16px 0", textAlign: "center" }}>
          Loading ticket history...
        </div>
      );
    }

    if (historyError) {
      return (
        <div
          style={{ padding: "16px 0", textAlign: "center", color: "#ff4d4f" }}
        >
          Failed to load ticket history
        </div>
      );
    }

    if (!historyData || historyData.length === 0) {
      return (
        <div style={{ padding: "16px 0", textAlign: "center", color: "#999" }}>
          No ticket history available
        </div>
      );
    }

    return (
      <div style={{ padding: "16px 0" }}>
        <List
          dataSource={historyData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.title}</span>
                    <Tag color="blue">{item.id}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: "4px" }}>
                      {item.description}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Created:{" "}
                      {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                      {item.updatedAt !== item.createdAt && (
                        <span style={{ marginLeft: "8px" }}>
                          | Updated:{" "}
                          {dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm")}
                        </span>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
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
              >
                Edit
              </Button>
              {onDelete && (
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                >
                  Delete
                </Button>
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
      width={600}
    >
      <Tabs defaultActiveKey="details">
        <TabPane tab="Details" key="details">
          {renderDetailsTab()}
        </TabPane>
        <TabPane tab="History" key="history">
          {renderHistoryTab()}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default TicketViewModal;
