// Category-related types

export interface CategoryProps {
  label: { guid: string; title: string };
  onTicketUpdate: () => void;
}
