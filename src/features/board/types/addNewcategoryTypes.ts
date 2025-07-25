export interface CategoryFormData {
  title: string;
}

export interface AddNewCategoryProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}
