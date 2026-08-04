const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://atharvgiri07:giri1234@cluster0.9c3ezdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected Successfully");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

test();