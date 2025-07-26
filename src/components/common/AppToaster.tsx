import React from "react";
import { Toaster } from "react-hot-toast";

const AppToaster: React.FC = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: "#363636",
        color: "#fff",
      },
      success: {
        duration: 3000,
        style: {
          background: "#52c41a",
        },
      },
      error: {
        duration: 5000,
        style: {
          background: "#ff4d4f",
        },
      },
    }}
  />
);

export default AppToaster;
