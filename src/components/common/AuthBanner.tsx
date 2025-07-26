import React from "react";
import todoPng from "@/assets/to-do.webp";

const AuthBanner: React.FC = () => (
  <img
    src={todoPng}
    alt="Todo"
    className="mx-auto mb-4 w-20 h-20 object-contain"
  />
);

export default AuthBanner;
