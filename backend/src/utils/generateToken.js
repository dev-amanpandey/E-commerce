import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: '7d',
  });
};

export default generateToken;


