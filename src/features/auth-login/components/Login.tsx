import { Form, Button, Card, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { emailRules, passwordRules } from "../utils/validationRules";
import AuthBanner from "@/components/common/AuthBanner";
import PageTransition from "@/components/common/PageTransition";
import { useLoginMutation } from "@/store/services/authApi";
import type { ILoginFormValues } from "../types";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: ILoginFormValues) => {
    try {
      const result = await login(values).unwrap();

      // Save token to localStorage
      localStorage.setItem("accessToken", result.accessToken);

      // Show success message
      message.success("Login successful!");

      // Navigate to board
      navigate("/board");
    } catch (error) {
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.message ||
        "Login failed. Please try again.";

      message.error(errorMessage);
    }
  };

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-screen w-screen overflow-hidden -mt-12">
        <Card className="w-full max-w-md" bordered>
          <AuthBanner />
          <h2 className="text-xl font-semibold text-center mb-6">Login</h2>
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
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
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={passwordRules}>
              <Input.Password placeholder="Enter your password" />
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
