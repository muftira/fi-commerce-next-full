import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/utils/hooks';
import { fetchData } from '@/utils/fetch';
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
  const [checkEmail, setCheckEmail] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const debounce: string = useDebounce(email, 1000);
  const router = useRouter();
  const handleCheckEmail = async (): Promise<void> => {
    const response = await fetchData('GET', `api/user/email?email=${email}`);
    if (response.success) {
      setCheckEmail(true);
    } else {
      setCheckEmail(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoader(true);
    const response = await fetchData('POST', 'api/user/forgot-password', { email });
    if (response.success) {
      setIsLoader(false);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (debounce) {
      handleCheckEmail();
    }
    if (debounce === '') {
      setCheckEmail(true);
    }
  }, [debounce]);
  return (
    <Card className="w-[350px] md:w-[450px]">
      <CardHeader>
        <CardTitle>Find Your Account</CardTitle>
        <CardDescription>
          Please enter your email address to search for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex space-x-2 relative">
                <Label htmlFor="name">Email</Label>
                {debounce && (
                  <div className="flex absolute left-8 top-1/2 -translate-y-1/2">
                    {checkEmail ? (
                      <IoIosClose className="text-red-600" />
                    ) : (
                      <IoCheckmarkOutline className="text-green-600 text-[14px] me-[2px] mb-[2px]" />
                    )}
                    <p className={`text-[10px] text-${checkEmail ? 'red' : 'green'}-600`}>
                      {checkEmail ? 'Email has not been registered.' : 'Email has been registered.'}
                    </p>
                  </div>
                )}
              </div>

              <Input
                id="name"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex w-full justify-center">
        <Modal
          className="w-full"
          isModalOpen={isModalOpen}
          handleSubmit={() => handleSubmit()}
          validationData={checkEmail}
          onClick={() => router.push('/auth/login')}
          isLoader={isLoader}
          text={{
            title: 'Success!',
            description:
              "Thanks. If there's an account associated with this email address, we'll send the password reset instructions.\n\n- This link is valid for the next 24 hours.\n- If you don't receive an email within 10 minutes, check your spam folder first and then try again.",
            button: 'Send Link',
          }}
        />
      </CardFooter>
    </Card>
  );
}
