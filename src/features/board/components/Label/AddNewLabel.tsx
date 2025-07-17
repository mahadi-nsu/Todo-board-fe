import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
// import { useCreateLabelMutation } from "@/store/api/labelApi"; // Uncomment and adjust path as needed

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [createLabel, { isLoading }] = useCreateLabelMutation(); // Uncomment and adjust path as needed
  const isLoading = false; // Remove this when using the actual mutation

  const handleSubmit = async (values: LabelFormData) => {
    if (!values.title.trim()) {
      message.error("Label title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // await createLabel({
      //   title: values.title.trim(),
      //   user_guid: values.user_guid || "user-1",
      // }).unwrap();
      message.success("Label created successfully!");
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Failed to create label:", error);
      message.error("Failed to create label. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsSubmitting(false);
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
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={isSubmitting || isLoading}
          >
            Create Label
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddNewLabel;
