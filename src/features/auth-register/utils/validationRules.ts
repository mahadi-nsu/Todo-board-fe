import type { Rule } from "antd/es/form";
import {
  emailRules,
  passwordRules,
} from "@/features/auth-login/utils/validationRules";

export const nameRules: Rule[] = [
  { required: true, message: "Please input your name!" },
];

export const confirmPasswordRules: Rule[] = [
  { required: true, message: "Please confirm your password!" },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    },
  }),
];

export { emailRules, passwordRules };
