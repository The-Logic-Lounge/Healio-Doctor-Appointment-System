// Local MongoDB for development - no Mongo installation needed.
// Data persists in ./data/db. Start it with: npm run db
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

(async () => {
  const dbPath = path.join(__dirname, "..", "data", "db");
  fs.mkdirSync(dbPath, { recursive: true });
  const mongod = await MongoMemoryServer.create({
    instance: { port: 27017, ip: "127.0.0.1", dbPath },
  });
  console.log("MONGO READY at", mongod.getUri());
  console.log("Keep this terminal open while you use the app.");
})().catch((e) => {
  console.error("dev-db failed:", e.message);
  process.exit(1);
});
