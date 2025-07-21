import React from "react";
import { Button, Input, message } from "antd";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/store/services/categoryApi";

const CategoryTest: React.FC = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [newCategoryTitle, setNewCategoryTitle] = React.useState("");
  const [editingCategory, setEditingCategory] = React.useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim()) {
      message.warning("Please enter a category title");
      return;
    }

    try {
      await createCategory({ title: newCategoryTitle.trim() }).unwrap();
      message.success("Category created successfully!");
      setNewCategoryTitle("");
    } catch (error) {
      message.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.title.trim()) {
      message.warning("Please enter a category title");
      return;
    }

    try {
      await updateCategory({
        id: editingCategory.id,
        title: editingCategory.title.trim(),
      }).unwrap();
      message.success("Category updated successfully!");
      setEditingCategory(null);
    } catch (error) {
      message.error("Failed to update category");
    }
  };

  const handleEditCategory = (category: { id: number; title: string }) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return (
      <div
        style={{
          color: "red",
          padding: "10px",
          border: "1px solid red",
          margin: "10px",
        }}
      >
        <h3>Categories Error</h3>
        <p>
          Message:{" "}
          {"status" in error
            ? (error.data as any)?.message || `HTTP ${error.status}`
            : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        color: "green",
        padding: "10px",
        border: "1px solid green",
        margin: "10px",
      }}
    >
      <h3>Categories Test</h3>

      <div style={{ marginBottom: "15px" }}>
        <h4>Create New Category:</h4>
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <Input
            placeholder="Enter category title"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            onPressEnter={handleCreateCategory}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            onClick={handleCreateCategory}
            loading={isCreating}
          >
            Create
          </Button>
        </div>
      </div>

      <div>
        <h4>Existing Categories ({categories?.length || 0}):</h4>
        <ul>
          {categories?.map((category) => (
            <li key={category.id} style={{ marginBottom: "8px" }}>
              {editingCategory?.id === category.id ? (
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <Input
                    value={editingCategory.title}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        title: e.target.value,
                      })
                    }
                    onPressEnter={handleUpdateCategory}
                    style={{ flex: 1 }}
                  />
                  <Button
                    size="small"
                    onClick={handleUpdateCategory}
                    loading={isUpdating}
                  >
                    Save
                  </Button>
                  <Button size="small" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span>
                    {category.title} (ID: {category.id})
                  </span>
                  <Button
                    size="small"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryTest;
