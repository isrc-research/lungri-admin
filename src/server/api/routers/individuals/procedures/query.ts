import { publicProcedure } from "@/server/api/trpc";
import { individualQuerySchema } from "../individuals.schema";
import { lungriIndividual } from "@/server/db/schema/family/individual";
import { and, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const getAll = publicProcedure
  .input(individualQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy, sortOrder, filters } = input;
    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];
      if (filters.wardNo) {
        filterConditions.push(eq(lungriIndividual.wardNo, filters.wardNo));
      }
      if (filters.familyId) {
        filterConditions.push(eq(lungriIndividual.familyId, filters.familyId));
      }
      if (filters.gender) {
        filterConditions.push(eq(lungriIndividual.gender, filters.gender));
      }
      if (filters.ageRange) {
        if (filters.ageRange.min !== undefined) {
          filterConditions.push(sql`${lungriIndividual.age} >= ${filters.ageRange.min}`);
        }
        if (filters.ageRange.max !== undefined) {
          filterConditions.push(sql`${lungriIndividual.age} <= ${filters.ageRange.max}`);
        }
      }
      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(lungriIndividual)
        .where(conditions)
        .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(lungriIndividual)
        .where(conditions)
        .then((result) => result[0].count),
    ]);

    return {
      data,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const individual = await ctx.db
      .select()
      .from(lungriIndividual)
      .where(eq(lungriIndividual.id, input.id))
      .limit(1);

    if (!individual[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Individual not found",
      });
    }

    return individual[0];
  });

export const getStats = publicProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db
    .select({
      totalIndividuals: sql<number>`count(*)`,
      averageAge: sql<number>`ROUND(AVG(${lungriIndividual.age}))::integer`}).from(lungriIndividual);

  return stats[0];
}
);
