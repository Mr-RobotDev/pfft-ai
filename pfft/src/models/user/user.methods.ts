import bcrypt from 'bcryptjs';

export async function comparePassword(enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
}
