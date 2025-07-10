export type PasswordHide = {
  password: boolean;
  confirmPassword: boolean;
};

export type Login = {
  status?: boolean;
  email: string;
  password: string;
};

export type Signup = {
  profilePicture: File | null;
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  address: string;
  phoneNumber: string;
};

export type Header = {
  'Content-Type': string;
  Authorization?: string;
  AllowedOrigin: string;
};

export type ModalProps<T> = {
  className?: string;
  isModalOpen?: boolean;
  handleSubmit?: (e: T) => void;
  validationData?: boolean;
  onClick?: (e: T) => void;
  isLoader?: boolean;
  text?: { title: string; description: string; button: string };
};

export type ResetPassword = {
  password: string;
  confirmPassword: string;
};

export type UserResponse = {
  id: number,
  fullName: string,
  email: string,
  password: string,
  address: string,
  phone: string,
  roleId: number,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date

}

export type JwtPayload = {
  id: number;
  role: string;
  email: string;
}

export type UserLogin = {
  name: string;
  email: string;
  profilePicture: string | null;
};


