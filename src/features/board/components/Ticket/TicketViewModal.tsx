import React, { useState } from "react";
import {
  Modal,
  Tabs,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  message,
  List,
  Tag,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { TicketData } from "./Ticket";
import { useGetTicketHistoryQuery } from "@/store/services/ticketApi";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface TicketViewModalProps {
  visible: boolean;
  ticket: TicketData | null;
  onClose: () => void;
  onUpdate: (updatedTicket: Partial<TicketData>) => void;
  onDelete?: () => void;
}

const TicketViewModal: React.FC<TicketViewModalProps> = ({
  visible,
  ticket,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useGetTicketHistoryQuery();

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
      message.success("Ticket updated successfully!");
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
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
            <div style={{ marginTop: "4px" }}>{ticket?.title}</div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Description:</strong>
            <div style={{ marginTop: "4px" }}>{ticket?.description}</div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Expires At:</strong>
            <div style={{ marginTop: "4px" }}>
              {ticket?.expiresAt
                ? dayjs(ticket.expiresAt).format("YYYY-MM-DD HH:mm")
                : "Not set"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Category:</strong>
            <div style={{ marginTop: "4px" }}>
              {ticket?.category?.title || "Not assigned"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Labels:</strong>
            <div style={{ marginTop: "4px" }}>
              {ticket?.labels && ticket.labels.length > 0 ? (
                <Space size="small">
                  {ticket.labels.map((labelItem) => (
                    <Tag key={labelItem.label.id} color="blue">
                      {labelItem.label.title}
                    </Tag>
                  ))}
                </Space>
              ) : (
                "No labels"
              )}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Created:</strong>
            <div style={{ marginTop: "4px" }}>
              {ticket?.createdAt
                ? dayjs(ticket.createdAt).format("YYYY-MM-DD HH:mm")
                : "N/A"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Last Updated:</strong>
            <div style={{ marginTop: "4px" }}>
              {ticket?.updatedAt
                ? dayjs(ticket.updatedAt).format("YYYY-MM-DD HH:mm")
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
