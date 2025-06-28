import { app } from "./app";
import { PORT } from "./config/config";
import { connectToDB } from "./utils/db";
import { connectToRedis } from "./utils/redis";
app.listen(PORT, () => {
  console.log(`Serving on PORT : ${PORT}`);
  connectToDB()
  connectToRedis()
});
