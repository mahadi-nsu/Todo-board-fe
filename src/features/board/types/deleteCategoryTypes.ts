export interface DeleteCategoryModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading: boolean;
  categories: Array<{ id: number; title: string }>;
  currentCategoryId: number;
  selectedDestinationCategory: number | null;
  setSelectedDestinationCategory: (id: number | null) => void;
  labelTitle: string;
}
