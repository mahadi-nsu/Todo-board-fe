export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface ILoginError {
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
