// src/server/api/routers/tasks.ts

import { z } from "zod";
import { taskData } from "../../../../prisma/zod-utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tasksRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, user } = ctx;

    return await prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });
  }),
  create: protectedProcedure
    .input(taskData)
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;

      return await prisma.task.create({
        data: {
          ...input,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      taskData.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          tasks: {
            update: {
              where: {
                id: input.id,
              },
              data: {
                ...input,
              },
            },
          },
        },
      });
    }),
});
