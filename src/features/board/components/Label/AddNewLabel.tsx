import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useCreateCategoryMutation } from "@/store/services/categoryApi";

interface AddNewLabelProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

interface LabelFormData {
  title: string;
  user_guid: string;
}

const AddNewLabel: React.FC<AddNewLabelProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm<LabelFormData>();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (values: LabelFormData) => {
    if (!values.title.trim()) {
      message.error("Label title is required");
      return;
    }

    try {
      await createCategory({
        title: values.title.trim(),
      }).unwrap();
      message.success("Category created successfully!");
      form.resetFields();
      onSuccess();
    } catch (error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to create category";
      message.error(errorMessage);
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
          {/* <PlusOutlined className="text-blue-500" /> */}
          <span>Add New Label</span>
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
          label="Label Title"
          rules={[
            { required: true, message: "Please enter a label title" },
            {
              min: 1,
              max: 50,
              message: "Title must be between 1 and 50 characters",
            },
          ]}
        >
          <Input
            placeholder="Enter label title (e.g., To Do, In Progress, Done)"
            maxLength={50}
            showCount
            autoFocus
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        <Form.Item name="user_guid" label="User ID" hidden>
          <Input />
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
            Create Label
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddNewLabel;
