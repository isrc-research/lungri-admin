import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import lungriAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { lungriCrop } from "@/server/db/schema/family/crops";
import { lungriAnimal } from "@/server/db/schema/family/animals";
import { lungriAnimalProduct } from "@/server/db/schema/family/animal-products";

export const getAgriculturalLandStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        ownershipType: lungriAgriculturalLand.landOwnershipType,
        totalArea: sql<number>`sum(${lungriAgriculturalLand.landArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(lungriAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(lungriAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(lungriAgriculturalLand.landOwnershipType);
  });

export const getIrrigationStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        isIrrigated: lungriAgriculturalLand.isLandIrrigated,
        totalArea: sql<number>`sum(${lungriAgriculturalLand.irrigatedLandArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(lungriAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(lungriAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(lungriAgriculturalLand.isLandIrrigated);
  });

export const getCropStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        cropType: lungriCrop.cropType,
        cropName: lungriCrop.cropName,
        totalArea: sql<number>`sum(${lungriCrop.cropArea})::float`,
        totalProduction: sql<number>`sum(${lungriCrop.cropProduction})::float`,
        totalRevenue: sql<number>`sum(${lungriCrop.cropRevenue})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(lungriCrop);

    if (input.wardNumber) {
      query.where(eq(lungriCrop.wardNo, input.wardNumber));
    }

    return await query.groupBy(lungriCrop.cropType, lungriCrop.cropName);
  });

export const getAnimalStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        animalName: lungriAnimal.animalName,
        totalCount: sql<number>`sum(${lungriAnimal.totalAnimals})::int`,
        totalSales: sql<number>`sum(${lungriAnimal.animalSales})::float`,
        totalRevenue: sql<number>`sum(${lungriAnimal.animalRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(lungriAnimal);

    if (input.wardNumber) {
      query.where(eq(lungriAnimal.wardNo, input.wardNumber));
    }

    return await query.groupBy(lungriAnimal.animalName);
  });

export const getAnimalProductStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        productName: lungriAnimalProduct.animalProductName,
        unit: lungriAnimalProduct.animalProductUnit,
        totalProduction: sql<number>`sum(${lungriAnimalProduct.animalProductProduction})::float`,
        totalSales: sql<number>`sum(${lungriAnimalProduct.animalProductSales})::float`,
        totalRevenue: sql<number>`sum(${lungriAnimalProduct.animalProductRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(lungriAnimalProduct);

    if (input.wardNumber) {
      query.where(eq(lungriAnimalProduct.wardNo, input.wardNumber));
    }

    return await query.groupBy(
      lungriAnimalProduct.animalProductName,
      lungriAnimalProduct.animalProductUnit
    );
  });

export const getAgriculturalLandOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalLandArea: sql<number>`sum(${lungriAgriculturalLand.landArea})::float`,
        totalIrrigatedArea: sql<number>`sum(${lungriAgriculturalLand.irrigatedLandArea})::float`,
        householdCount: sql<number>`count(distinct ${lungriAgriculturalLand.familyId})::int`,
      })
      .from(lungriAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(lungriAgriculturalLand.wardNo, input.wardNumber));
    }

    return (await query)[0];
  });

export const getAgricultureOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const baseWhere = input.wardNumber
      ? sql`ward_no = ${input.wardNumber}`
      : sql`1=1`;

    const [crops, animals, products] = await Promise.all([
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(crop_revenue)::float as total_revenue,
          SUM(crop_area)::float as total_area
        FROM ${lungriCrop}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_revenue)::float as total_revenue,
          SUM(total_animals)::int as total_count
        FROM ${lungriAnimal}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_product_revenue)::float as total_revenue
        FROM ${lungriAnimalProduct}
        WHERE ${baseWhere}
      `),
    ]);

    return {
      crops: crops[0],
      animals: animals[0],
      animalProducts: products[0],
    };
  });
