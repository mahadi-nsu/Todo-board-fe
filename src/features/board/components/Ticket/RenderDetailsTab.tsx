import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Card,
  Descriptions,
  Space,
  Tag,
  Divider,
  Select,
  Button,
} from "antd";
import {
  PlusOutlined,
  TagOutlined,
  FolderOutlined,
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { TicketData } from "../../types/ticketTypes";

const { TextArea } = Input;

interface RenderDetailsTabProps {
  isEditing: boolean;
  form: any;
  ticket: TicketData | null;
  localTicket: TicketData | null;
  selectedLabelIds: number[];
  setSelectedLabelIds: (ids: number[]) => void;
  availableLabels: any;
  availableCategories: any;
  handleRemoveLabel: (labelId: number) => void;
  handleAddLabels: () => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const RenderDetailsTab: React.FC<RenderDetailsTabProps> = ({
  isEditing,
  form,
  ticket,
  localTicket,
  selectedLabelIds,
  setSelectedLabelIds,
  availableLabels,
  availableCategories,
  handleRemoveLabel,
  handleAddLabels,
  handleDescriptionChange,
}) => {
  return (
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
            <TextArea
              rows={4}
              placeholder="Enter ticket description"
              onChange={handleDescriptionChange}
            />
          </Form.Item>

          <Form.Item
            name="expiresAt"
            label="Expires At"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.isBefore(dayjs().startOf("day"))) {
                    return Promise.reject(
                      new Error("Expiry date cannot be in the past")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Select expiry date"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </Form>
      ) : (
        <div>
          {/* Main Ticket Information Card */}
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: "#1890ff" }} />
                <span>Ticket Information</span>
              </Space>
            }
            style={{ marginBottom: "16px" }}
            size="small"
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined style={{ color: "#666" }} />
                    <span>Title</span>
                  </Space>
                }
              >
                <div style={{ fontWeight: 500, color: "#262626" }}>
                  {localTicket?.title}
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <EditOutlined style={{ color: "#666" }} />
                    <span>Description</span>
                  </Space>
                }
              >
                <div style={{ color: "#595959", lineHeight: "1.5" }}>
                  {localTicket?.description}
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <CalendarOutlined style={{ color: "#666" }} />
                    <span>Expires At</span>
                  </Space>
                }
              >
                <div style={{ color: "#595959" }}>
                  {localTicket?.expiresAt ? (
                    dayjs(localTicket.expiresAt).format("YYYY-MM-DD HH:mm")
                  ) : (
                    <span style={{ color: "#bfbfbf" }}>Not set</span>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Category and Labels Card */}
          <Card
            title={
              <Space>
                <FolderOutlined style={{ color: "#52c41a" }} />
                <span>Classification</span>
              </Space>
            }
            style={{ marginBottom: "16px" }}
            size="small"
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <FolderOutlined style={{ color: "#666" }} />
                    <span>Category</span>
                  </Space>
                }
              >
                <Tag color="green" style={{ margin: 0 }}>
                  {localTicket?.category?.title || "Not assigned"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* Labels Section - Separate from Descriptions */}
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <TagOutlined style={{ color: "#666" }} />
                <span>Labels</span>
              </div>

              <div style={{ marginBottom: "12px" }}>
                {localTicket?.labels && localTicket.labels.length > 0 ? (
                  <Space size="small" wrap>
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
                  <span style={{ color: "#bfbfbf" }}>No labels</span>
                )}
              </div>

              {/* Add Label Section */}
              <Divider style={{ margin: "12px 0" }} />
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
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
                  size="middle"
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Metadata Card */}
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: "#722ed1" }} />
                <span>Metadata</span>
              </Space>
            }
            size="small"
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined style={{ color: "#666" }} />
                    <span>Created</span>
                  </Space>
                }
              >
                <div style={{ color: "#595959" }}>
                  {localTicket?.createdAt
                    ? dayjs(localTicket.createdAt).format("YYYY-MM-DD HH:mm")
                    : "N/A"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined style={{ color: "#666" }} />
                    <span>Last Updated</span>
                  </Space>
                }
              >
                <div style={{ color: "#595959" }}>
                  {localTicket?.updatedAt
                    ? dayjs(localTicket.updatedAt).format("YYYY-MM-DD HH:mm")
                    : "N/A"}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RenderDetailsTab;
