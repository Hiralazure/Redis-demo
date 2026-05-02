import Redis from "ioredis";
//redis client library for nodejs

const redis = new Redis();
async function ioRedisDemo() {
  try {
    await redis.set("eky", "value");
    const val = await redis.get("eky");
    console.log(val);
  } catch (e) {
    console.log(e);
  } finally {
    redis.quit();
  }
}
ioRedisDemo();
