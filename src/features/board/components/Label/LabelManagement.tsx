import React, { useState } from "react";
import {
  Modal,
  Table,
  Button,
  Space,
  Input,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetLabelsQuery,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
  type Label,
} from "@/store/services/labelApi";
import AddNewLabel from "./AddNewLabel";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { Search } = Input;

interface LabelManagementProps {
  visible: boolean;
  onClose: () => void;
}

interface EditLabelData {
  id: number;
  title: string;
}

const LabelManagement: React.FC<LabelManagementProps> = ({
  visible,
  onClose,
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingLabel, setEditingLabel] = useState<EditLabelData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [editingTitle, setEditingTitle] = useState("");

  const { data: labels, isLoading, refetch } = useGetLabelsQuery();
  const [updateLabel] = useUpdateLabelMutation();
  const [deleteLabel] = useDeleteLabelMutation();

  const handleAddSuccess = () => {
    setIsAddModalVisible(false);
    refetch();
    toast.success("Label added successfully!");
  };

  const handleEdit = (record: Label) => {
    setEditingLabel(record);
    setEditingTitle(record.title);
  };

  const handleSaveEdit = async () => {
    if (!editingLabel || !editingTitle.trim()) {
      toast.error("Label title is required");
      return;
    }

    try {
      await updateLabel({
        id: editingLabel.id,
        title: editingTitle.trim(),
      }).unwrap();

      setEditingLabel(null);
      setEditingTitle("");
      refetch();
      toast.success("Label updated successfully!");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update label";
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingLabel(null);
    setEditingTitle("");
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLabel(id).unwrap();
      refetch();
      toast.success("Label deleted successfully!");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete label";
      toast.error(errorMessage);
    }
  };

  const filteredLabels =
    labels?.filter((label) =>
      label.title.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  const columns = [
    {
      title: "Label",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Label) => {
        if (editingLabel?.id === record.id) {
          return (
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onPressEnter={handleSaveEdit}
              autoFocus
            />
          );
        }
        return <Tag color="blue">{text}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Label) => {
        if (editingLabel?.id === record.id) {
          return (
            <Space>
              <Button type="primary" size="small" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button size="small" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Space>
          );
        }
        return (
          <Space>
            <Tooltip title="Edit label">
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Delete Label"
              description="Are you sure you want to delete this label? This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Tooltip title="Delete label">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Label Management"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        destroyOnClose
      >
        <div className="mb-4 flex items-center gap-3">
          <Search
            placeholder="Search labels..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Add Label
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredLabels}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} labels`,
          }}
        />
      </Modal>

      <AddNewLabel
        visible={isAddModalVisible}
        onSuccess={handleAddSuccess}
        onCancel={() => setIsAddModalVisible(false)}
      />
    </>
  );
};

export default LabelManagement;
