import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useCreateCategoryMutation } from "@/store/services/categoryApi";
import toast from "react-hot-toast";

import { categoryTitleRules } from "../../utils/addNewCategoryUtils";
import type {
  AddNewCategoryProps,
  CategoryFormData,
} from "../../types/addNewcategory";

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
      width="90%"
      style={{ maxWidth: 500 }}
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
          rules={categoryTitleRules}
        >
          <Input
            placeholder="Enter category title (e.g., To Do, In Progress, Done)"
            maxLength={50}
            showCount
            autoFocus
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
            size="large"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={isLoading}
            className="w-full sm:w-auto"
            size="large"
          >
            Create Category
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddNewCategory;
