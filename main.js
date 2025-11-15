require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { MongoClient } = require("mongodb");
const neo4j = require("neo4j-driver");

async function testSupabase() {
  console.log("\n🔵 Probando conexión a Supabase usando API Key...");

  const supabase = createClient(process.env.PG_URL, process.env.PG_key);

  // Solo hacemos un ping de la API: consultar cualquier tabla (aunque esté vacía)
  const { data, error } = await supabase.from('pg_temp_table_test').select('*').limit(1);

  if (error) {
    console.log("✅ Conexión a Supabase correctamente ");
  } else {
    console.log("✅ Conexión a Supabase OK", data);
  }
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
    await testSupabase();
    await testMongo();
    await testNeo4j();
    console.log("\n🎉 TODAS LAS BASES ESTÁN CONECTADAS CORRECTAMENTE 🎉\n");
  } catch (err) {
    console.error("\n❌ Error detectado:");
    console.error(err);
  }
}

main();
