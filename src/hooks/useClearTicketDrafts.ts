import { useEffect } from "react";

export const useClearTicketDrafts = () => {
  useEffect(() => {
    const clearTicketDrafts = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("ticket-draft-")) {
          localStorage.removeItem(key);
        }
      });
    };
    window.addEventListener("load", clearTicketDrafts);
    return () => {
      window.removeEventListener("load", clearTicketDrafts);
    };
  }, []);
};
