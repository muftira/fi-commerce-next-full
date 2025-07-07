import type { File } from 'multer';

declare module 'next' {
  interface NextApiRequest {
    file?: File;
    files?: File[];
    user?: {
      id: number;
      role: string;
      email: string;
    };
  }
}
