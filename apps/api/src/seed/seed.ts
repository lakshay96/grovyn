import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import {
  AnalyticsEvent,
  ChatMessage,
  Inquiry,
  Property,
  User,
} from "../models";
import { SEED_PROPERTIES, makeHotspots, makeRooms } from "./data";

async function seed(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`Connecting to ${env.mongoUri} ...`);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  // eslint-disable-next-line no-console
  console.log("Connected. Clearing existing data ...");

  await Promise.all([
    Property.deleteMany({}),
    User.deleteMany({}),
    Inquiry.deleteMany({}),
    ChatMessage.deleteMany({}),
    AnalyticsEvent.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);
  const users = await User.create([
    { name: "Aarav Mehta (Agent)", email: "agent@grovyn.in", passwordHash, role: "agent", phone: "+91 99999 11111" },
    { name: "Demo User", email: "demo@grovyn.in", passwordHash, role: "user", phone: "+91 99999 00000" },
    { name: "Grovyn Admin", email: "admin@grovyn.in", passwordHash, role: "admin", phone: "+91 99999 00001" },
  ]);
  // eslint-disable-next-line no-console
  console.log(`Inserted ${users.length} users (agent/demo/admin, password: password123).`);

  const agent = users.find((u) => u.email === "agent@grovyn.in");
  if (!agent) throw new Error("Seed agent user missing");

  const docs = SEED_PROPERTIES.map((p, i) => ({
    ...p,
    owner: agent._id,
    rooms: p.propertyType === "plot" ? undefined : makeRooms(p.bedrooms),
    tourHotspots: makeHotspots(p.panoramaUrls.length),
    floorPlanUrl: p.images[0],
    views: 120 + (SEED_PROPERTIES.length - i) * 37,
  }));

  const inserted = await Property.create(docs);
  // eslint-disable-next-line no-console
  console.log(`Inserted ${inserted.length} properties.`);

  const now = Date.now();
  const events = [];
  for (let d = 0; d < 14; d += 1) {
    const day = new Date(now - d * 864e5);
    const count = 3 + ((d * 7) % 9);
    for (let n = 0; n < count; n += 1) {
      const prop = inserted[(d + n) % inserted.length];
      events.push({ type: "view" as const, property: prop._id, createdAt: day, meta: {} });
    }
  }
  await AnalyticsEvent.insertMany(events);
  // eslint-disable-next-line no-console
  console.log(`Inserted ${events.length} demo analytics events.`);

  const demo = users.find((u) => u.email === "demo@grovyn.in");
  if (demo) {
    demo.wishlist = [inserted[0]._id, inserted[2]._id];
    demo.recentlyViewed = [inserted[1]._id, inserted[4]._id, inserted[6]._id];
    await demo.save();
  }

  await mongoose.disconnect();
  // eslint-disable-next-line no-console
  console.log("Seed complete.");
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed:", err);
  process.exit(1);
});
