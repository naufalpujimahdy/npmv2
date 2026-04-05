import type { Prisma, User } from '@prisma/client';
import prisma from '../lib/prisma';

export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;
export type UserRecord = User;

export const createUser = async (userData: CreateUserInput) => {
  return prisma.user.create({ data: userData });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id: Number(id) } });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
};

export const updateUser = async (id: string, userData: UpdateUserInput) => {
  return prisma.user.update({
    where: { id: Number(id) },
    data: userData,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id: Number(id) } });
};
