export interface LabelManagementProps {
  visible: boolean;
  onClose: () => void;
}

export interface EditLabelData {
  id: number;
  title: string;
}

export interface AddNewLabelProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface LabelFormData {
  title: string;
}
