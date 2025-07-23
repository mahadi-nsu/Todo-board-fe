import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import { PlusOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import toast from "react-hot-toast";
import { useCreateTicketMutation } from "@/store/services/ticketApi";

const { TextArea } = Input;

interface AddNewTicketProps {
  visible: boolean;
  labelTitle: string;
  categoryId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface TicketFormData {
  title: string;
  description: string;
  label: string;
  expiry_date: Dayjs;
  user_guid: string;
}

const AddNewTicket: React.FC<AddNewTicketProps> = ({
  visible,
  labelTitle,
  categoryId,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm<TicketFormData>();
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        label: labelTitle,
        expiry_date: dayjs().add(1, "day"),
        user_guid: "user-1",
      });
    }
  }, [visible, labelTitle, form]);

  const handleSubmit = async (values: TicketFormData) => {
    if (!values.title.trim()) {
      toast.error("Ticket title is required");
      return;
    }
    if (!values.description.trim()) {
      toast.error("Ticket description is required");
      return;
    }

    try {
      // Set the expiration date to the end of the selected day (23:59:59)
      let expiresAt: string;
      if (values.expiry_date) {
        const selectedDate = values.expiry_date;
        const isToday = selectedDate.isSame(dayjs(), "day");

        if (isToday) {
          // If today is selected, set to end of day (23:59:59)
          expiresAt = selectedDate.endOf("day").toISOString();
        } else {
          // For future dates, set to end of day (23:59:59)
          expiresAt = selectedDate.endOf("day").toISOString();
        }
      } else {
        toast.error("Please select an expiry date");
        return;
      }

      await createTicket({
        title: values.title.trim(),
        description: values.description.trim(),
        expiresAt: expiresAt,
        categoryId: categoryId,
      }).unwrap();

      toast.success("Ticket created successfully!");
      form.resetFields();
      onSuccess();
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create ticket";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleModalCancel = () => {
    const hasChanges =
      form.getFieldValue("title")?.trim() ||
      form.getFieldValue("description")?.trim();
    if (hasChanges) {
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

  // Disable past dates
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <PlusOutlined className="text-blue-500" />
          <span>Add New Ticket</span>
        </div>
      }
      open={visible}
      onCancel={handleModalCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: "",
          description: "",
          label: labelTitle,
          expiry_date: dayjs().add(1, "day"),
          user_guid: "user-1",
        }}
        className="mt-4"
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label="Ticket Title"
          rules={[
            { required: true, message: "Please enter a ticket title" },
            {
              min: 1,
              max: 100,
              message: "Title must be between 1 and 100 characters",
            },
            {
              validator: (_, value) => {
                if (value && value.trim().length === 0) {
                  return Promise.reject(new Error("Title cannot be empty"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter ticket title"
            maxLength={100}
            showCount
            autoFocus
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter a description" },
            {
              min: 1,
              max: 500,
              message: "Description must be between 1 and 500 characters",
            },
            {
              validator: (_, value) => {
                if (value && value.trim().length === 0) {
                  return Promise.reject(
                    new Error("Description cannot be empty")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea
            placeholder="Enter ticket description"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="label"
          label="Label"
          rules={[{ required: true, message: "Please select a label" }]}
        >
          <Input value={labelTitle} disabled />
        </Form.Item>

        <Form.Item
          name="expiry_date"
          label="Expiry Date"
          rules={[
            { required: true, message: "Please select an expiry date" },
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
            placeholder="Select expiry date"
            format="YYYY-MM-DD"
            className="w-full"
            allowClear={false}
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item name="user_guid" label="User ID" hidden>
          <Input />
        </Form.Item>

        <div className="flex justify-end space-x-2 mt-6 gap-2">
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={isCreating}
          >
            Create Ticket
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddNewTicket;
