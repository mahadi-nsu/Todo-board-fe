import PageTransition from "@/components/common/PageTransition";
import { Button } from "antd";
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
        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Mobile-friendly header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Task Board
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                icon={<TagsOutlined />}
                onClick={handleLabelManagement}
                className="w-full sm:w-auto"
                size="large"
              >
                <span className="hidden sm:inline">Manage Labels</span>
                <span className="sm:hidden">Labels</span>
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
                className="w-full sm:w-auto"
                size="large"
              >
                <span className="hidden sm:inline">Add Category</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Mobile-friendly board content */}
          <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
            <div className="flex flex-col sm:flex-row gap-4 min-w-max px-4 sm:px-0">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="w-full sm:min-w-[320px] sm:max-w-xs flex-shrink-0"
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
