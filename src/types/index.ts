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
  profilePicture: { url: string | null }
};

export type VariantsData = {
  variant?: string;
  option: string[];
}

export type OptionVariants = {
  value: string
  label: string;
  isSelected?: boolean;
}

export type OptionSelected = {
  option: OptionVariants[];
}

export type RequestProduct = {
  productName: string,
  imageProduct: File[] | null,
  categoryName: string,
  description: string,
  status: string,
  sku: string,
  options: Option[],
  variants: Variant[]
}

export type Option = {
  id?: number;
  name: string;
  isDeleted?: boolean;
  value: Value[] | []
}
export type Value = {
  id?: number;
  name: string;
  value?: number;
  isDeleted?: boolean;
}

export type Variant = {
  id?: number,
  option1: string | undefined,
  option2: string | undefined,
  price: number,
  quantity: number,
  weight: String,
  discount: number,
  isDeleted?: boolean
  sku: string;
}

export type OptionBody = {
  id?: number; 
  name: string; 
  createdAt?: Date; 
  updatedAt?: Date; 
  isDeleted?: boolean; 
  productId?: number | null;
  value?: ValueBody[]
}

export type ValueBody = {
  id?: number; 
  name: string; 
  createdAt?: Date; 
  updatedAt?: Date; 
  isDeleted?: boolean; 
  optionId?: number | null;
}

export type VariantBody = {
  id?: number;
  productId?: number;
  option1?: string;
  option2?: string;
  price?: number;
  quantity?: number;
  weight?: number;
  discount?: number;
  sku?: string;
  compareAtPrice?: number;
  isDeleted?: boolean;
}



