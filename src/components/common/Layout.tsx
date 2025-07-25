import React from "react";
import { Layout as AntLayout } from "antd";
import UserProfile from "./UserProfile";

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout className="min-h-screen">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: 0,
            }}
          >
            📋 Todo Board
          </h1>
        </div>
        <UserProfile />
      </Header>
      <Content className="p-6">{children}</Content>
    </AntLayout>
  );
};

export default Layout;
