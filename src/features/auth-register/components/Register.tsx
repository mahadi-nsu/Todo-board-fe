import { Form, Button, Card, Input } from "antd";
import { Link } from "react-router-dom";
import {
  emailRules,
  passwordRules,
  nameRules,
  confirmPasswordRules,
} from "../utils/validationRules";
import AuthBanner from "@/components/common/AuthBanner";
import type { IRegisterFormValues } from "../types";

const Register = () => {
  const onFinish = (values: IRegisterFormValues) => {
    console.log("Success:", values);
  };

  return (
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
            <Button type="primary" htmlType="submit" block>
              Register
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
  );
};

export default Register;
