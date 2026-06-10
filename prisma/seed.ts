import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SLOTS = [
  { startTime: "06:00", endTime: "07:00" },
  { startTime: "07:00", endTime: "08:00" },
  { startTime: "08:00", endTime: "09:00" },
  { startTime: "09:00", endTime: "10:00" },
  { startTime: "10:00", endTime: "11:00" },
  { startTime: "12:00", endTime: "13:00" },
  { startTime: "14:00", endTime: "15:00" },
  { startTime: "16:00", endTime: "17:00" },
  { startTime: "17:00", endTime: "18:00" },
  { startTime: "18:00", endTime: "19:00" },
];

async function main() {
  const adminExists = await prisma.admin.findUnique({
    where: { username: "admin" },
  });

  if (!adminExists) {
    const hash = await bcrypt.hash("Admin@123", 12);
    await prisma.admin.create({
      data: { username: "admin", passwordHash: hash },
    });
    console.log("✓ Admin seeded  (username: admin | password: Admin@123)");
  } else {
    console.log("✓ Admin already exists — skipped.");
  }

  const slotCount = await prisma.slot.count();
  if (slotCount === 0) {
    for (const slot of SLOTS) {
      await prisma.slot.create({ data: { ...slot, capacity: 20 } });
    }
    console.log(`✓ ${SLOTS.length} slots seeded.`);
  } else {
    console.log(`✓ Slots already seeded (${slotCount} found) — skipped.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
