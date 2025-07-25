import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

export function getCategoryMenuItems(
  handleEditCategory: () => void,
  handleDeleteCategory: () => void
) {
  return [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Category",
      onClick: handleEditCategory,
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Category",
      danger: true,
      onClick: handleDeleteCategory,
    },
  ];
}
