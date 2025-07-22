export interface IRegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterError {
  message: string;
  field?: string;
  code?: string;
}

export interface IApiError {
  data?: {
    message?: string;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  };
  status?: number;
  message?: string;
}
