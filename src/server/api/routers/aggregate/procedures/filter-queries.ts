import { publicProcedure } from "@/server/api/trpc";
import { sql } from "drizzle-orm";
import { lungriAggregateBuilding } from "@/server/db/schema/aggregate-building";

export const getDistinctWardNumbers = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      wardNumber: lungriAggregateBuilding.ward_number,
    })
    .from(lungriAggregateBuilding)
    .where(sql`${lungriAggregateBuilding.ward_number} IS NOT NULL`)
    .orderBy(lungriAggregateBuilding.ward_number);

  return results
    .filter(({ wardNumber }) => wardNumber !== null)
    .map(({ wardNumber }) => ({
      id: wardNumber!.toString(),
      wardNumber: wardNumber!,
    }));
});

export const getDistinctAreaCodes = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      areaCode: lungriAggregateBuilding.area_code,
    })
    .from(lungriAggregateBuilding)
    .where(sql`${lungriAggregateBuilding.area_code} IS NOT NULL`)
    .orderBy(lungriAggregateBuilding.area_code);

  return results
    .filter(({ areaCode }) => areaCode !== null)
    .map(({ areaCode }) => ({
      id: areaCode!.toString(),
      areaCode: areaCode!,
    }));
});

export const getDistinctEnumerators = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      enumeratorId: lungriAggregateBuilding.enumerator_id,
      enumeratorName: lungriAggregateBuilding.enumerator_name,
    })
    .from(lungriAggregateBuilding)
    .where(sql`${lungriAggregateBuilding.enumerator_id} IS NOT NULL`)
    .orderBy(lungriAggregateBuilding.enumerator_name);

  return results
    .filter(({ enumeratorId }) => enumeratorId !== null)
    .map(({ enumeratorId, enumeratorName }) => ({
      id: enumeratorId!,
      name: enumeratorName || "Unknown Enumerator",
    }));
});

export const getDistinctMapStatuses = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      mapStatus: lungriAggregateBuilding.map_status,
    })
    .from(lungriAggregateBuilding)
    .where(sql`${lungriAggregateBuilding.map_status} IS NOT NULL`)
    .orderBy(lungriAggregateBuilding.map_status);

  return results
    .filter(({ mapStatus }) => mapStatus !== null)
    .map(({ mapStatus }) => ({
      id: mapStatus!,
      name: mapStatus!,
    }));
});

export const getDistinctBuildingOwnerships = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingOwnership: lungriAggregateBuilding.building_ownership_status,
      })
      .from(lungriAggregateBuilding)
      .where(
        sql`${lungriAggregateBuilding.building_ownership_status} IS NOT NULL`,
      )
      .orderBy(lungriAggregateBuilding.building_ownership_status);

    return results
      .filter(({ buildingOwnership }) => buildingOwnership !== null)
      .map(({ buildingOwnership }) => ({
        id: buildingOwnership!,
        name: buildingOwnership!.replace(/_/g, " "),
      }));
  },
);

export const getDistinctBuildingBases = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingBase: lungriAggregateBuilding.building_base,
      })
      .from(lungriAggregateBuilding)
      .where(sql`${lungriAggregateBuilding.building_base} IS NOT NULL`)
      .orderBy(lungriAggregateBuilding.building_base);

    return results
      .filter(({ buildingBase }) => buildingBase !== null)
      .map(({ buildingBase }) => ({
        id: buildingBase!,
        name: buildingBase!.replace(/_/g, " "),
      }));
  },
);
