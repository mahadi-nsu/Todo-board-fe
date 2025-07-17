import { Form, Button, Card, Input } from "antd";
import { emailRules, passwordRules } from "../utils/validationRules";
import AuthBanner from "@/components/common/AuthBanner";
import type { ILoginFormValues } from "../types";

const Login = () => {
  const onFinish = (values: ILoginFormValues) => {
    console.log("Success:", values);
  };

  return (
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
            required={false}
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
