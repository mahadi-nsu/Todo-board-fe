import React from "react";
import { Dropdown, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/store/services/authApi";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetCurrentUserQuery();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <div className="font-medium">{user?.name || "User"}</div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: (
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="w-full text-left"
        >
          Logout
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Avatar icon={<UserOutlined />} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f3f4f6")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <Avatar icon={<UserOutlined />} />
        <div style={{ display: "none" }} className="md:block">
          <div style={{ fontWeight: "500" }}>{user?.name || "User"}</div>
        </div>
      </div>
    </Dropdown>
  );
};

export default UserProfile;
