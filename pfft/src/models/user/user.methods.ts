const bcrypt = require('bcrypt');

export async function comparePassword(enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
}
