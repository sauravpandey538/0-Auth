import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    //console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL || "");
    // TODO : console db and db.connection
    connection.isConnected = db.connections[0].readyState;
    //console.log("DB connected sucessfully");
  } catch (error) {
    //console.log("Error during mongodb connection", error);
    process.exit(1);
  }
}
export default dbConnect;
