import { Form, Button, Card, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { emailRules, passwordRules } from "../utils/validationRules";
import { parseLoginError } from "../utils/errorUtils";
import AuthBanner from "@/components/common/AuthBanner";
import PageTransition from "@/components/common/PageTransition";
import ErrorAlert from "@/components/common/ErrorAlert";
import { useLoginMutation } from "@/store/services/authApi";
import type { ILoginFormValues, ILoginError } from "../types";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [form] = Form.useForm();
  const [error, setError] = useState<ILoginError | null>(null);

  const onFinish = async (values: ILoginFormValues) => {
    try {
      setError(null);
      const result = await login(values).unwrap();
      localStorage.setItem("accessToken", result.accessToken);
      toast.success("Login successful!");
      navigate("/board");
    } catch (error) {
      const parsedError = parseLoginError(error);
      setError(parsedError);
      toast.error(parsedError.message);

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
          <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

          {/* Error Alert */}
          <ErrorAlert error={error} onClose={() => setError(null)} />

          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            autoComplete="off"
            requiredMark={false}
          >
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

            <Form.Item label="Password" name="password" rules={passwordRules}>
              <Input.Password
                placeholder="Enter your password"
                status={error?.field === "password" ? "error" : undefined}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
          <hr className="border-t border-dotted border-neutral-400 my-4" />
          <div className="text-center mt-2">
            <Link to="/register" className="text-blue-600 hover:underline">
              Don't registered yet?{" "}
              <span className="font-semibold">Go to register</span>
            </Link>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
