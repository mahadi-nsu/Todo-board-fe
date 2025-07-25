import type { Rule } from "antd/es/form";

export const categoryTitleRules: Rule[] = [
  { required: true, message: "Please enter a category title" },
  {
    min: 1,
    max: 50,
    message: "Title must be between 1 and 50 characters",
  },
];
