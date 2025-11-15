require("dotenv").config();
const { Client } = require("pg");
const { MongoClient } = require("mongodb");
const neo4j = require("neo4j-driver");

async function testPostgres() {
  console.log("\n🔵 Probando conexión a PostgreSQL / Supabase...");
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("✅ PostgreSQL conectado correctamente");
  await client.end();
}

async function testMongo() {
  console.log("\n🟢 Probando conexión a MongoDB Atlas...");
  const mongo = new MongoClient(process.env.MONGO_URI);

  await mongo.connect();
  console.log("✅ MongoDB conectado correctamente");
  await mongo.close();
}

async function testNeo4j() {
  console.log("\n🔴 Probando conexión a Neo4j AuraDB...");
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  await session.run("RETURN 1 AS result");
  console.log("✅ Neo4j conectado correctamente");

  await session.close();
  await driver.close();
}

async function main() {
  console.log("===== Verificando conexiones de Base de Datos =====");
  try {
    await testPostgres();
    await testMongo();
    await testNeo4j();
    console.log("\n🎉 TODAS LAS BASES ESTÁN CONECTADAS CORRECTAMENTE 🎉\n");
  } catch (err) {
    console.error("\n❌ Error detectado:");
    console.error(err);
  }
}

main();
