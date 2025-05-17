import { User } from '../models/user';

const UserTransformer = (data: User) => {
  const { password, ...userData } = data;
  return userData;
};

export default UserTransformer;
