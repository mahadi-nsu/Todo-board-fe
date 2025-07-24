import React from "react";
import { Modal, Select } from "antd";

interface DeleteCategoryModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading: boolean;
  categories: Array<{ id: number; title: string }>;
  currentCategoryId: number;
  selectedDestinationCategory: number | null;
  setSelectedDestinationCategory: (id: number | null) => void;
  labelTitle: string;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  visible,
  onOk,
  onCancel,
  confirmLoading,
  categories,
  currentCategoryId,
  selectedDestinationCategory,
  setSelectedDestinationCategory,
  labelTitle,
}) => {
  return (
    <Modal
      title="Delete Category"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
      okType="danger"
      confirmLoading={confirmLoading}
    >
      <div style={{ marginBottom: "16px" }}>
        <p>
          Are you sure you want to delete <strong>"{labelTitle}"</strong>?
        </p>
        <p style={{ marginTop: "8px", color: "red", fontWeight: "bold" }}>
          All tickets in this category will be moved to the selected destination
          category.
        </p>
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Move existing tickets to:
        </label>
        <Select
          placeholder="Select destination category"
          style={{ width: "100%" }}
          value={selectedDestinationCategory}
          onChange={setSelectedDestinationCategory}
          options={
            categories
              ?.filter((cat) => cat.id !== currentCategoryId)
              .map((cat) => ({
                label: cat.title,
                value: cat.id,
              })) || []
          }
        />
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
