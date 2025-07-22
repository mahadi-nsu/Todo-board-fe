import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useCreateCategoryMutation } from "@/store/services/categoryApi";
import toast from "react-hot-toast";

interface CategoryFormData {
  title: string;
}

interface AddNewCategoryProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddNewCategory: React.FC<AddNewCategoryProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm<CategoryFormData>();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (values: CategoryFormData) => {
    if (!values.title.trim()) {
      toast.error("Category title is required");
      return;
    }

    try {
      await createCategory({
        title: values.title.trim(),
      }).unwrap();
      toast.success("Category created successfully!");
      form.resetFields();
      onSuccess();
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create category";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleModalCancel = () => {
    if (form.getFieldValue("title")?.trim()) {
      Modal.confirm({
        title: "Discard Changes?",
        content:
          "You have unsaved changes. Are you sure you want to discard them?",
        okText: "Discard",
        cancelText: "Keep Editing",
        onOk: handleCancel,
      });
    } else {
      handleCancel();
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <span>Add New Category</span>
        </div>
      }
      open={visible}
      onCancel={handleModalCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label="Category Title"
          rules={[
            { required: true, message: "Please enter a category title" },
            {
              min: 1,
              max: 50,
              message: "Title must be between 1 and 50 characters",
            },
          ]}
        >
          <Input
            placeholder="Enter category title (e.g., To Do, In Progress, Done)"
            maxLength={50}
            showCount
            autoFocus
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        <div className="flex justify-end space-x-2 mt-6 gap-4">
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={isLoading}
          >
            Create Category
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddNewCategory;
