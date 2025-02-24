import { prisma } from "@/lib/prisma";

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const expirePassword = async (userId: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastPasswordChangeAt: new Date(),
      isActive: false,
    },
  });
};

export const unsuspendUser = async (userId: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isSuspended: false,
      suspensionEnds: null,
      suspensionStart: null,
    },
  });
};

export const resetFailedLoginAttempts = async (userId: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      failedLoginAttempts: 0,
    },
  });
};

export const handleFailedLoginAttempt = async (userId: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      failedLoginAttempts: {
        increment: 1,
      },
    },
  });
};

export const suspendUser = async (userId: number, until: Date) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isSuspended: true,
      suspensionStart: new Date(),
      suspensionEnd: until,
    },
  });
};
