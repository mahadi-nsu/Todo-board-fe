import PageTransition from "@/components/common/PageTransition";

const TodoBoard = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Board</h1>
        </div>
      </div>
    </PageTransition>
  );
};

export default TodoBoard;
