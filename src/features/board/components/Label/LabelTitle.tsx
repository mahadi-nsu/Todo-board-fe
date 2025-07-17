import React, { useState } from "react";
import { Typography, Input, Button, Space } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

// FIXME: Will move this to types folder
interface LabelTitleProps {
  label: { guid: string; title: string };
  onSuccess: () => void;
  onCancel: () => void;
}

const LabelTitle: React.FC<LabelTitleProps> = ({
  label,
  onSuccess,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(label.title);

  const handleEdit = () => {
    setIsEditing(true);
    setTitle(label.title);
  };

  const handleSave = () => {
    if (title.trim() === "") return;
    setIsEditing(false);
    onSuccess();
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
    <div className="flex items-center space-x-2">
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

export default LabelTitle;
