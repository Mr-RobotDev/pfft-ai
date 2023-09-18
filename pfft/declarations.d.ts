import type mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: typeof mongoose;
    }
  }
}
