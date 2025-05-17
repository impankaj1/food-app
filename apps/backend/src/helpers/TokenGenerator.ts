import { jwt_refresh_secret, jwt_secret } from '..';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const tokenGenerator = (user: User) => {
  const authToken = jwt.sign(
    { email: user.email, first_name: user.first_name },
    jwt_secret,
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { email: user.email, first_name: user.first_name },
    jwt_refresh_secret,
    { expiresIn: '90d' }
  );

  return { authToken, refreshToken };
};

export default tokenGenerator;
