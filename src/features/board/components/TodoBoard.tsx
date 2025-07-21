import PageTransition from "@/components/common/PageTransition";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import AddNewLabel from "@/features/board/components/Label/AddNewLabel";
import Label from "@/features/board/components/Label/Label";
import { useGetCategoriesQuery } from "@/store/services/categoryApi";

const TodoBoard = () => {
  const [isAddLabelVisible, setIsAddLabelVisible] = useState(false);
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  const handleAddLabel = () => setIsAddLabelVisible(true);
  const handleAddLabelSuccess = () => setIsAddLabelVisible(false);
  const handleAddLabelCancel = () => setIsAddLabelVisible(false);

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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddLabel}
            >
              Add Label
            </Button>
          </div>
          {/* Board Content with horizontal scroll */}
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-row gap-4 min-w-max">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="min-w-[320px] max-w-xs flex-shrink-0"
                >
                  <Label
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
        <AddNewLabel
          visible={isAddLabelVisible}
          onSuccess={handleAddLabelSuccess}
          onCancel={handleAddLabelCancel}
        />
      </div>
    </PageTransition>
  );
};

export default TodoBoard;
