import 'next-auth';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface JWT {
    /** The user's role. */
    _id?: string;
  }
  interface Session {
    user: {
      _id?: string;
    } & DefaultSession['user'];
  }
}
