-- CreateTable
CREATE TABLE "service_categories" (
  "code" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name_fr" TEXT NOT NULL,
  "name_ar" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 100,
  "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- Redefine Service with foreign key to categories
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "providerId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "description" TEXT,
  "descriptionAr" TEXT,
  "category" TEXT NOT NULL,
  "icon" TEXT,
  "basePrice" INTEGER NOT NULL DEFAULT 0,
  "isPopular" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Service_category_fkey" FOREIGN KEY ("category") REFERENCES "service_categories" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("id","providerId","name","nameAr","description","descriptionAr","category","icon","basePrice","isPopular","createdAt","updatedAt") SELECT "id","providerId","name","nameAr","description","descriptionAr","category","icon","basePrice","isPopular","createdAt","updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE INDEX "idx_service_provider_category" ON "Service"("providerId","category");
PRAGMA foreign_keys=ON;

-- Seed categories
INSERT INTO "service_categories" ("code","slug","name_fr","name_ar","sort_order","is_active") VALUES
('PLOMBERIE','plomberie','Plomberie','السباكة',100,1),
('ELECTRICITE','electricite','Électricité','الكهرباء',100,1),
('PEINTURE','peinture','Peinture','الصباغة',100,1),
('NETTOYAGE','nettoyage','Nettoyage (ménage)','التنظيف المنزلي',100,1),
('MENUISERIE_BOIS','menuiserie-bois','Menuiserie bois','نجارة الخشب',100,1),
('ALU_PVC','alu-pvc','Aluminium / PVC','ألمنيوم وPVC',100,1);
