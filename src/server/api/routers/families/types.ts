import { family } from "@/server/db/schema";
import { lungriAnimalProduct } from "@/server/db/schema/family/animal-products";
import { lungriAnimal } from "@/server/db/schema/family/animals";
import { lungriCrop } from "@/server/db/schema/family/crops";
import lungriAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { lungriIndividual } from "@/server/db/schema/family/individual";

export type FamilyResult = typeof family.$inferSelect & {
  agriculturalLands: (typeof lungriAgriculturalLand.$inferSelect)[];
  animals: (typeof lungriAnimal.$inferSelect)[];
  animalProducts: (typeof lungriAnimalProduct.$inferSelect)[];
  crops: (typeof lungriCrop.$inferSelect)[];
  individuals: (typeof lungriIndividual.$inferSelect)[];
};
