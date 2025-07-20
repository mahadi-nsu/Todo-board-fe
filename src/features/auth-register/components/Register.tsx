import { Form, Button, Card, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  emailRules,
  passwordRules,
  nameRules,
  confirmPasswordRules,
} from "../utils/validationRules";
import AuthBanner from "@/components/common/AuthBanner";
import PageTransition from "@/components/common/PageTransition";
import {
  useRegisterMutation,
  useLoginMutation,
} from "@/store/services/authApi";
import type { IRegisterFormValues } from "../types";

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const onFinish = async (values: IRegisterFormValues) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;

      // Register the user
      await register(registerData).unwrap();
      message.success("Registration successful!");

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
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.message ||
        "Registration failed. Please try again.";

      message.error(errorMessage);
    }
  };

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-screen w-screen overflow-hidden -mt-12">
        <Card className="w-full max-w-md" bordered>
          <AuthBanner />
          <h2 className="text-xl font-semibold text-center mb-6">Register</h2>
          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
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
              <Input placeholder="Enter your name" />
            </Form.Item>

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

            <Form.Item
              label="Password"
              name="password"
              rules={passwordRules}
              style={{
                marginBottom: "12px",
              }}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={confirmPasswordRules}
            >
              <Input.Password placeholder="Confirm your password" />
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
