import React from "react";
import { Form, Input, Button, Card } from "antd";
import todoPng from "@/assets/to-do.png";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const onFinish = (values: LoginFormValues) => {
    console.log("Success:", values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen overflow-hidden">
      <Card className="w-full max-w-md" bordered>
        <img
          src={todoPng}
          alt="Todo"
          className="mx-auto mb-4 w-20 h-20 object-contain"
        />
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
            required={false}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            style={{
              marginBottom: "12px",
            }}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <hr className="border-t border-dotted border-neutral-400 my-4" />
        </Form>
        <div className="text-center mt-2">
          <a href="#" className="text-blue-600 hover:underline">
            Don't registered yet?{" "}
            <span className="font-semibold">Go to register</span>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
