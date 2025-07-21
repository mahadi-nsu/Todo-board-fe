import React from "react";
import { useGetCategoriesQuery } from "@/store/services/categoryApi";

const CategoryTest: React.FC = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

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
      <p>Found {categories?.length || 0} categories:</p>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>
            {category.title} (ID: {category.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryTest;
