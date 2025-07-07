//types
import { ModalProps } from '@/types';

// Components
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Modal<T>({
  className,
  isModalOpen,
  handleSubmit,
  validationData,
  onClick,
  isLoader,
  text,
}: ModalProps<T>) {
  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className={className}
          onClick={(e) => handleSubmit && handleSubmit(e as unknown as T)}
          disabled={validationData}
        >
          {isLoader ? <Loader2 className={`${isLoader && 'animate-spin'}`} /> : ''}
          {text?.button}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{text?.title}</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {text?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={(e) => onClick && onClick(e as unknown as T)}>
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
