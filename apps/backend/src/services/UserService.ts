import UserModel, { User } from '../models/user';
import { SignUpDTO } from '../validators/AuthValidator';

class UserService {
  private static _instance: UserService | null;
  public static getInstance(): UserService {
    if (!this._instance) this._instance = new UserService();
    return this._instance;
  }

  public async createUser(payload: SignUpDTO): Promise<User> {
    const user = await UserModel.create(payload);
    return user.toObject();
  }

  public async getUsers(): Promise<User[]> {
    const dbUsers = await UserModel.find();
    return dbUsers.map((u) => u.toObject());
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      email: email,
    });
    return user ? user.toObject() : null;
  }

  public async deleteUser(id: string): Promise<User | null> {
    const user = await UserModel.findByIdAndDelete(id);
    return user ? user.toObject() : null;
  }

  public async updateUser(
    id: string,
    payload: Partial<SignUpDTO>
  ): Promise<User | null> {
    const user = await UserModel.findById(id);

    if (!user) {
      return null;
    }

    if (payload.email) {
      user.email = payload.email;
    }

    if (payload.first_name) {
      user.first_name = payload.first_name;
    }

    if (payload.last_name) {
      user.last_name = payload.last_name;
    }

    if (payload.password) {
      user.password = payload.password;
    }

    if (payload.phone_no) {
      user.phone_no = payload.phone_no;
    }
    await user.save();

    return user.toObject();
  }
}

export const userService = UserService.getInstance();
