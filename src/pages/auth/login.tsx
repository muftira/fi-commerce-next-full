import { GalleryVerticalEnd } from 'lucide-react';
import { ModeToggle } from '@/components/toggle-dark-mode';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 relative">
      <div className='flex items-center mr-6 gap-2 absolute top-4 right-4'>
        <p className='text-black dark:text-white'>Mode :</p>
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
