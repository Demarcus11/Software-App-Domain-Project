import { verify } from "jsonwebtoken";

const decodeToken = (token: string): any => {
  try {
    const jwt_secret = process.env.JWT_SECRET;

    if (!jwt_secret) {
      console.error("JWT_SECRET is not defined in the environment variables");
      return null;
    }

    const decoded = verify(token, jwt_secret);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default decodeToken;
