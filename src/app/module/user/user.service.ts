import { prisma } from "../../lib/prisma";
import { IUpdateUserPayload } from "./user.interface";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return users;
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUser = async (userId: string, payload: IUpdateUserPayload) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
  return result;
};

const deleteUser = async (userId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    try {
      await tx.financialRecord.updateMany({
        where: {
          creatorId: userId,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      const result = await tx.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      return result;
    } catch (error) {
      console.log("Transaction Error : ", error);
      throw error;
    }
  });
  return result;
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
