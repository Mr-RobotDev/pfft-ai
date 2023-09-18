import type { IUserDocument } from '@models/user/user.types';

export async function findOneOrCreate(
  userData: IUserDocument
): Promise<IUserDocument> {
  const { email } = userData;
  const record = await this.findOne({ email });
  if (record) {
    return { ...record, alreadyExist: true };
  }
  return this.create(userData);
}
