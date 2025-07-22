import { Alert } from "antd";
import { useState } from "react";

interface ErrorAlertProps {
  error: {
    message: string;
    field?: string;
    code?: string;
  } | null;
  onClose?: () => void;
  className?: string;
}

const ErrorAlert = ({ error, onClose, className = "" }: ErrorAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!error || !isVisible) {
    return null;
  }

  return (
    <Alert
      message={error.message}
      type="error"
      showIcon
      className={`mb-4 ${className}`}
      closable
      onClose={handleClose}
    />
  );
};

export default ErrorAlert;
