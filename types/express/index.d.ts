import { User } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/auth';


declare global {
  namespace Express {
    export interface Request {
      firebaseUser?: DecodedIdToken;
      user?: User;
    }
  }
}