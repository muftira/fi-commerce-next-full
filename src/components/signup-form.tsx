import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PasswordHide, Signup } from '@/types';
import { useDebounce } from '@/utils/hooks';
import { fetchData } from '@/utils/fetch';

// components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Asterisk from '@/components/asterisk';
import Modal from '@/components/modal';

// icons
import { BiShowAlt, BiSolidHide } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import { IoCheckmarkOutline } from 'react-icons/io5';

export function SignUpForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Signup>({
    profilePicture: null,
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: '',
  });

  const [hidePassword, setHidePassword] = useState<PasswordHide>({
    password: false,
    confirmPassword: false,
  });

  const [checkEmail, setCheckEmail] = useState<boolean | string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isValidationPhoto, setIsValidationPhoto] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const debounce: string = useDebounce(data.email, 1000);

  const handleSubmit = async (): Promise<void> => {
    setIsValidationPhoto(false);
    setIsLoader(true);
    const submitedData = new FormData();
    submitedData.append('fullName', data.fullName);
    submitedData.append('email', data.email);
    submitedData.append('password', data.password);
    submitedData.append('address', data.address);
    submitedData.append('phone', data.phoneNumber);
    submitedData.append('roleName', 'customer');
    if (data.profilePicture instanceof File) {
      submitedData.append('imageProfile', data.profilePicture);
    }

    const response = await fetchData('POST', 'api/user/register', submitedData, true);

    if (response.success) {
      setIsLoader(false);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCheckEmail = async (): Promise<void> => {
    const response = await fetchData('GET', `api/user/email?email=${data.email}`);
    if (response.success) {
      setCheckEmail(true);
    } else {
      setCheckEmail(false);
    }
  };

  const validationData = (): boolean => {
    if (
      data.fullName &&
      data.email &&
      data.password &&
      data.address &&
      data.phoneNumber &&
      data.password === data.confirmPassword &&
      checkEmail &&
      data.password.length >= 5 &&
      !isLoader
    ) {
      return false;
    }
    return true;
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (
      file &&
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/jpg'
    ) {
      setIsValidationPhoto(true);
      setIsModalOpen(true);
      e.target.value = '';
      return;
    }
    setData((prev) => ({
      ...prev,
      profilePicture: file || null,
    }));
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setData((prev) => ({ ...prev, profilePicture: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageUrl(undefined);
  };

  useEffect(() => {
    if (data.email) {
      handleCheckEmail();
    }
  }, [data.email]);

  return (
    <Card className="md:w-[700px] w-[300px] md:h-[680px]">
      <CardHeader className="text-center">
        <CardTitle>Create Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="md:grid md:grid-flow-col md:grid-rows-2 flex flex-col w-full md:items-center gap-4">
            <div className="flex flex-col md:h-[520px] justify-between space-y-1.5 row-span-6">
              <Label htmlFor="fullName">Profile Picture</Label>
              <div className="flex justify-center items-center">
                <Avatar className="md:w-[300px] md:h-[300px] w-[150px] h-[150px]">
                  <AvatarImage src={imageUrl} alt="ImageProfile" />
                  <AvatarFallback className="text-4xl">PP</AvatarFallback>
                </Avatar>
              </div>
              <div className="relative cursor-pointer">
                <Input
                  className="flex justify-center cursor-pointer absolute z-10 opacity-0 w-[120px]"
                  id="profilePicture"
                  placeholder="Your Avatar"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleUploadPhoto(e)}
                />
                <div className="flex justify-between gap-2">
                  <Button className="cursor-pointer w-[120px]">
                    {data.profilePicture ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-300 cursor-pointer w-[120px]"
                    onClick={(e) => handleRemovePhoto(e)}
                  >
                    Delete Picture
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5 col-span-2">
              <Label htmlFor="fullName">
                Full Name
                <Asterisk />{' '}
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                onChange={(e) => setData((prev) => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col space-y-1.5 col-span-2">
              <div className="flex space-x-2 relative">
                <Label htmlFor="email">
                  Email
                  <Asterisk />
                </Label>
                {debounce && (
                  <div className="flex absolute left-8 top-1/2 -translate-y-1/2">
                    {!checkEmail ? (
                      <IoIosClose className="text-red-600" />
                    ) : (
                      <IoCheckmarkOutline className="text-green-600 text-[14px] me-[2px] mb-[2px]" />
                    )}
                    <p className={`text-[10px] text-${!checkEmail ? 'red' : 'green'}-600`}>
                      {!checkEmail ? 'Email is not availble.' : 'Email is availble.'}
                    </p>
                  </div>
                )}
              </div>

              <Input
                id="email"
                placeholder="Your email"
                type="email"
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex flex-col space-y-1.5 col-span-2">
              <div className="flex space-x-2 relative">
                <Label htmlFor="password">
                  Password
                  <Asterisk />
                </Label>
                {data.password && (
                  <div className="flex absolute left-[3.8rem] top-1/2 -translate-y-1/2">
                    {data.password.length < 5 ? (
                      <IoIosClose className="text-red-600" />
                    ) : (
                      <IoCheckmarkOutline className="text-green-600 text-[14px] me-[2px] mb-[2px]" />
                    )}
                    <p
                      className={`text-[10px] text-${data.password.length < 5 ? 'red' : 'green'}-600`}
                    >
                      {data.password.length < 5 ? 'Passwords do not match.' : 'Passwords match.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Your password"
                  type={hidePassword.password ? 'text' : 'password'}
                  onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                />
                {!hidePassword.password ? (
                  <BiShowAlt
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setHidePassword((prev) => ({ ...prev, password: !prev.password }))
                    }
                  />
                ) : (
                  <BiSolidHide
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setHidePassword((prev) => ({ ...prev, password: !prev.password }))
                    }
                  />
                )}
              </div>
              <p className={`text-[10px]`}>*Password must be at least 5 characters long.</p>
            </div>
            <div className="flex flex-col space-y-1.5 col-span-2">
              <div className="flex space-x-2 relative">
                <Label htmlFor="password">
                  Confirm Password
                  <Asterisk />
                </Label>
                {data.confirmPassword && (
                  <div className="flex absolute left-28 top-1/2 -translate-y-1/2">
                    {data.password !== data.confirmPassword ? (
                      <IoIosClose className="text-red-600" />
                    ) : (
                      <IoCheckmarkOutline className="text-green-600 text-[14px] me-[2px] mb-[2px]" />
                    )}
                    <p
                      className={`text-[10px] text-${data.password !== data.confirmPassword ? 'red' : 'green'}-600`}
                    >
                      {data.password !== data.confirmPassword
                        ? 'Passwords do not match.'
                        : 'Passwords match.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  id="confirm password"
                  placeholder="Your password"
                  type={hidePassword.confirmPassword ? 'text' : 'password'}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                />
                {!hidePassword.confirmPassword ? (
                  <BiShowAlt
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setHidePassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                  />
                ) : (
                  <BiSolidHide
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setHidePassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                  />
                )}
              </div>
              <p className={`text-[10px]`}>*Both password fields must be the same.</p>
            </div>
            <div className="flex flex-col space-y-1.5 col-span-2">
              <Label htmlFor="phone">
                Phone Number
                <Asterisk />
              </Label>
              <Input
                id="phone"
                placeholder="Your phone number"
                type="number"
                onChange={(e) => setData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
            <div className="flex flex-col space-y-1.5 col-span-2">
              <Label htmlFor="address">
                Address
                <Asterisk />
              </Label>
              <Textarea
                id="address"
                placeholder="Your address"
                onChange={(e) => setData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="w-[120px]"
          variant="outline"
          onClick={(e) => {
            e.preventDefault(), router.back();
          }}
        >
          Cancel
        </Button>

        <Modal
          className="w-[120px] cursor-pointer"
          isModalOpen={isModalOpen}
          handleSubmit={handleSubmit}
          validationData={validationData()}
          onClick={() => (isValidationPhoto ? setIsModalOpen(false) : router.push('/auth/login'))}
          isLoader={isLoader}
          text={
            isValidationPhoto
              ? {
                  title: 'Invalid file type!',
                  description: 'Please upload a JPG or JPEG or PNG image.',
                  button: 'Create',
                }
              : {
                  title: 'Success!',
                  description: 'Your account has been created. Please log in to continue.',
                  button: 'Create',
                }
          }
        />
      </CardFooter>
    </Card>
  );
}
