import PageTransition from "@/components/common/PageTransition";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import AddNewLabel from "@/features/board/components/Label/AddNewLabel";
import Label from "@/features/board/components/Label/Label";

// FIXME: Have to replace this with real data
const dummyLabels = [
  { guid: "1", title: "To Do" },
  { guid: "2", title: "In Progress" },
  { guid: "3", title: "Done" },
];

const TodoBoard = () => {
  const [isAddLabelVisible, setIsAddLabelVisible] = useState(false);

  const handleAddLabel = () => setIsAddLabelVisible(true);
  const handleAddLabelSuccess = () => setIsAddLabelVisible(false);
  const handleAddLabelCancel = () => setIsAddLabelVisible(false);

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
              {dummyLabels.map((label) => (
                <div
                  key={label.guid}
                  className="min-w-[320px] max-w-xs flex-shrink-0"
                >
                  <Label label={label} onTicketUpdate={() => {}} />
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
