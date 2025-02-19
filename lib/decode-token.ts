import { jwtVerify, JWTPayload } from "jose";

interface DecodedToken {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  iat: number;
  exp: number;
}

interface CustomJWTPayload extends JWTPayload {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

const decodeToken = async (token: string): Promise<DecodedToken | null> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const isCustomPayload = (
      payload: JWTPayload
    ): payload is CustomJWTPayload => {
      return (
        typeof (payload as CustomJWTPayload).userId === "string" &&
        typeof (payload as CustomJWTPayload).role === "string" &&
        typeof (payload as CustomJWTPayload).firstName === "string" &&
        typeof (payload as CustomJWTPayload).lastName === "string"
      );
    };

    if (!isCustomPayload(payload)) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      profilePictureUrl: payload.profilePictureUrl,
      iat: payload.iat!,
      exp: payload.exp!,
    };
  } catch (error) {
    return null;
  }
};

export default decodeToken;
