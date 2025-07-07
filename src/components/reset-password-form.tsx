import React, { useState, useEffect } from 'react';
import { fetchData } from '@/utils/fetch';
import { ResetPassword, PasswordHide } from '@/types';
import { useRouter } from 'next/router';

//components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/modal';

//icons
import { BiShowAlt, BiSolidHide } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import { IoCheckmarkOutline } from 'react-icons/io5';

export default function CardWithForm() {
  const [data, setData] = useState<ResetPassword>({
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const { token, email } = router.query;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<PasswordHide>({
    password: false,
    confirmPassword: false,
  });

  const validationData = (): boolean => {
    if (data.password.length < 5) {
      return true;
    }
    if (data.password !== data.confirmPassword) {
      return true;
    }
    return false;
  };
  const handleSubmit = async (): Promise<void> => {
    setIsLoader(true);
    const submitedData = {
      newPassword: data.password,
      email: email,
    };
    const response = await fetchData('POST', `api/user/reset-password?token=${token}`, submitedData);

    if (response.success) {
      setIsValid(true);
      setIsLoader(false);
      setIsModalOpen(true);
    } else {
      setIsValid(false);
      setIsLoader(false);
      setIsModalOpen(true);
    }
  };

  return (
    <Card className="w-[350px] md:w-[450px]">
      <CardHeader>
        <CardTitle>New password</CardTitle>
        {/* <CardDescription>
          Please enter your email address to search for your account.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex space-x-2 relative">
                <Label htmlFor="password">Password</Label>
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
            <div className="flex flex-col space-y-1.5">
              <div className="flex space-x-2 relative">
                <Label htmlFor="password">Confirm Password</Label>
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex w-full justify-center">
        <Modal
          className="w-full"
          isModalOpen={isModalOpen}
          handleSubmit={handleSubmit}
          validationData={validationData()}
          onClick={() => router.push('/auth/login')}
          isLoader={isLoader}
          text={
            isValid
              ? {
                  title: 'Success!',
                  description:
                    'Password has been updated successfully. You can now login with your new password.',
                  button: 'Update password',
                }
              : {
                  title: 'oops!',
                  description: 'Link has expired or is invalid.',
                  button: 'Update password',
                }
          }
        />
      </CardFooter>
    </Card>
  );
}
