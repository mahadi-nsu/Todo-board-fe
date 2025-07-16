import type { Rule } from "antd/es/form";

export const emailRules: Rule[] = [
  { required: true, message: "Please input your email!" },
  { type: "email", message: "Please enter a valid email!" },
];

export const passwordRules: Rule[] = [
  { required: true, message: "Please input your password!" },
  { min: 6, message: "Password must be at least 6 characters." },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
    message: "Password must contain upper, lower, and special character.",
  },
];
