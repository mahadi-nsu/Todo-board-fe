import { Form, Button, Card, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  emailRules,
  passwordRules,
  nameRules,
  confirmPasswordRules,
} from "../utils/validationRules";
import { parseRegisterError } from "../utils/errorUtils";
import AuthBanner from "@/components/common/AuthBanner";
import PageTransition from "@/components/common/PageTransition";
import ErrorAlert from "@/components/common/ErrorAlert";
import {
  useRegisterMutation,
  useLoginMutation,
} from "@/store/services/authApi";
import type { IRegisterFormValues, IRegisterError } from "../types";

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [form] = Form.useForm();
  const [error, setError] = useState<IRegisterError | null>(null);

  const onFinish = async (values: IRegisterFormValues) => {
    try {
      // Clear any previous errors
      setError(null);

      // Remove confirmPassword before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;

      // Register the user
      await register(registerData).unwrap();
      toast.success("Registration successful!");

      // Automatically log in the user
      const loginResult = await login({
        email: registerData.email,
        password: registerData.password,
      }).unwrap();

      // Save token to localStorage
      localStorage.setItem("accessToken", loginResult.accessToken);

      // Navigate to board
      navigate("/board");
    } catch (error) {
      const parsedError = parseRegisterError(error);
      setError(parsedError);

      // Show error message in toast as well
      toast.error(parsedError.message);

      // If it's a field-specific error, focus on that field
      if (parsedError.field) {
        form.setFields([
          {
            name: parsedError.field,
            errors: [parsedError.message],
          },
        ]);
      }
    }
  };

  const onValuesChange = () => {
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-screen w-screen overflow-hidden -mt-12">
        <Card className="w-full max-w-md" bordered>
          <AuthBanner />
          <h2 className="text-xl font-semibold text-center mb-6">Register</h2>

          {/* Error Alert */}
          <ErrorAlert error={error} onClose={() => setError(null)} />

          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={nameRules}
              style={{
                marginBottom: "12px",
              }}
            >
              <Input
                placeholder="Enter your name"
                status={error?.field === "name" ? "error" : undefined}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={emailRules}
              style={{
                marginBottom: "12px",
              }}
            >
              <Input
                placeholder="Enter your email"
                status={error?.field === "email" ? "error" : undefined}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={passwordRules}
              style={{
                marginBottom: "12px",
              }}
            >
              <Input.Password
                placeholder="Enter your password"
                status={error?.field === "password" ? "error" : undefined}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={confirmPasswordRules}
            >
              <Input.Password
                placeholder="Confirm your password"
                status={
                  error?.field === "confirmPassword" ? "error" : undefined
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isRegistering || isLoggingIn}
              >
                {isRegistering || isLoggingIn ? "Processing..." : "Register"}
              </Button>
            </Form.Item>
          </Form>
          <hr className="border-t border-dotted border-neutral-400 my-4" />
          <div className="text-center mt-2">
            <Link to="/" className="text-blue-600 hover:underline">
              Already have an account?{" "}
              <span className="font-semibold">Go to login</span>
            </Link>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Register;
