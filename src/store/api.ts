import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base API configuration
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
    prepareHeaders: (headers) => {
      // Get the token from localStorage or state
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Todo", "Board", "User"],
  endpoints: () => ({}),
});
