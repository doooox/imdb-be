import { Request, Response } from 'express';
import User from '../../models/User/userModel';
import { genSalt, hash, compare } from 'bcryptjs';
import { responseMessage } from '../../utils/helpers';

export const singupUser = async (req: Request, res: Response) => {
  const { email, name, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return responseMessage(400, res, "Passwords don't match!");
  }

  const userExists = await User.exists({ email });

  if (userExists) {
    return responseMessage(403, res, 'User already registerd!');
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return res.status(201).send({
      name: user.name,
      email: user.email,
    });
  }
  responseMessage(400, res, 'Invalid user data');
};

export const singiUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return responseMessage(404, res, 'Invalid email or password');
  }

  const matchingPasswords = await compare(password, user.password);

  if (!matchingPasswords) {
    return responseMessage(400, res, 'Invalid email or password');
  }

  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  res.status(201).send({
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export const singoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return responseMessage(400, res, 'Unable to log out!');
    }
    res.status(200).json({ message: 'User is logged out' });
  });
};
