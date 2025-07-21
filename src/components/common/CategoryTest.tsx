import React from "react";
import { Button, Input, message } from "antd";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "@/store/services/categoryApi";

const CategoryTest: React.FC = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [newCategoryTitle, setNewCategoryTitle] = React.useState("");

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
            <li key={category.id}>
              {category.title} (ID: {category.id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryTest;
