import "./App.css";
import Login from "./features/auth-login";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 min-w-[300px]">
        <h2 className="m-0 mb-3 text-xl font-semibold">Todo</h2>
        <p className="text-gray-600">
          This is a dummy todo card. Your todo will be here!
        </p>
      </div>
      <Login />
    </div>
  );
}

export default App;
