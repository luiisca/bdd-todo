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
      orderBy: {
        id: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(taskData)
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;
      const MAX_TEXT_LENGTH = 1000;

      let text = input.text;
      if (input.text.length > MAX_TEXT_LENGTH) {
        text = text.slice(0, MAX_TEXT_LENGTH);
      }
      return await prisma.task.create({
        data: {
          ...input,
          text,
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
        id: z.number().positive(),
        position: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      delete input.position;

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
