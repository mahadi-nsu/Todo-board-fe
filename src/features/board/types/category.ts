// Category-related types

export interface CategoryProps {
  label: { guid: string; title: string };
  onTicketUpdate: () => void;
}

export interface CategoryTitleProps {
  label: { guid: string; title: string };
  onSuccess: () => void;
  onCancel: () => void;
  forceEdit?: boolean;
}
