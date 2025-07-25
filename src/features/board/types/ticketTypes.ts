export interface TicketData {
  id: number;
  title: string;
  description: string;
  expiresAt?: string;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
  labels?: Array<{
    label: {
      id: number;
      title: string;
    };
  }>;
  category?: {
    id: number;
    title: string;
  };
  history?: Array<{
    createdAt: string;
    category: {
      id: number;
      title: string;
    };
  }>;
}

export interface TicketProps {
  ticket: TicketData;
  onClick?: (ticket: TicketData) => void;
  onDragStart?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}
