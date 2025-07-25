import { Dayjs } from "dayjs";

export interface AddNewTicketProps {
  visible: boolean;
  labelTitle: string;
  categoryId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface TicketFormData {
  title: string;
  description: string;
  label: string;
  expiry_date: Dayjs;
  user_guid: string;
}
