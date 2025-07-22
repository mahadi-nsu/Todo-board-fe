import PageTransition from "@/components/common/PageTransition";
import { Button, Space } from "antd";
import { PlusOutlined, TagsOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AddNewCategory, Category } from "@/features/board/components/Category";
import { LabelManagement } from "@/features/board/components/Label";
import { useGetCategoriesQuery } from "@/store/services/categoryApi";

const TodoBoard = () => {
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [isLabelManagementVisible, setIsLabelManagementVisible] =
    useState(false);
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  const handleAddCategory = () => setIsAddCategoryVisible(true);
  const handleAddCategorySuccess = () => setIsAddCategoryVisible(false);
  const handleAddCategoryCancel = () => setIsAddCategoryVisible(false);

  const handleLabelManagement = () => setIsLabelManagementVisible(true);
  const handleLabelManagementClose = () => setIsLabelManagementVisible(false);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div>Loading board...</div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-500">
            Error loading board:{" "}
            {"status" in error ? `HTTP ${error.status}` : "Unknown error"}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <Space>
              <Button icon={<TagsOutlined />} onClick={handleLabelManagement}>
                Manage Labels
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </Space>
          </div>
          {/* Board Content with horizontal scroll */}
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-row gap-4 min-w-max">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="min-w-[320px] max-w-xs flex-shrink-0"
                >
                  <Category
                    label={{
                      guid: category.id.toString(),
                      title: category.title,
                    }}
                    onTicketUpdate={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <AddNewCategory
          visible={isAddCategoryVisible}
          onSuccess={handleAddCategorySuccess}
          onCancel={handleAddCategoryCancel}
        />
        <LabelManagement
          visible={isLabelManagementVisible}
          onClose={handleLabelManagementClose}
        />
      </div>
    </PageTransition>
  );
};

export default TodoBoard;
