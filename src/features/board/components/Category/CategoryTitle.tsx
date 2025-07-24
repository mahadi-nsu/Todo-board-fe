import React, { useState } from "react";
import { Typography, Input, Button, Space, message } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useUpdateCategoryMutation } from "@/store/services/categoryApi";
import type { CategoryTitleProps } from "../../types/categoryTypes";

const { Text } = Typography;

const CategoryTitle: React.FC<CategoryTitleProps> = ({
  label,
  onSuccess,
  onCancel,
  forceEdit = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(label.title);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  // Trigger edit mode when forceEdit changes to true
  React.useEffect(() => {
    if (forceEdit && !isEditing) {
      setIsEditing(true);
    }
  }, [forceEdit, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setTitle(label.title);
  };

  const handleSave = async () => {
    if (title.trim() === "") return;

    try {
      await updateCategory({
        id: parseInt(label.guid),
        title: title.trim(),
      }).unwrap();
      message.success("Category updated successfully!");
      setIsEditing(false);
      onSuccess();
    } catch (error) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to update category";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(label.title);
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          size="small"
          className="flex-1"
          placeholder="Enter label title"
          maxLength={50}
        />
        <Space size="small">
          <Button
            type="text"
            icon={<CheckOutlined />}
            size="small"
            onClick={handleSave}
            loading={isLoading}
            className="text-green-600 hover:text-green-700"
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            size="small"
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700"
          />
        </Space>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 group">
      <Text strong className="text-lg truncate">
        {title}
      </Text>
      <Button
        type="text"
        icon={<EditOutlined />}
        size="small"
        onClick={handleEdit}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

export default CategoryTitle;
