import dayjs from "dayjs";

export function getExpiryStatus(expiresAt?: string) {
  let expiryStatus: "expired" | "expiring-soon" | null = null;
  let expiryText = "";
  let expiryColor = "";
  if (expiresAt) {
    const now = dayjs();
    const expires = dayjs(expiresAt);
    if (expires.isBefore(now, "minute")) {
      expiryStatus = "expired";
      expiryText = "Expired";
      expiryColor = "red";
    } else if (expires.diff(now, "hour") < 24) {
      expiryStatus = "expiring-soon";
      expiryText = "Expiring Soon";
      expiryColor = "orange";
    }
  }
  return { expiryStatus, expiryText, expiryColor };
}
