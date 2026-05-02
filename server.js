import redis from "redis";

const client = redis.createClient({
  host: "localhost", //redis server is hosted on localhost
  port: 6379, //default redis port
});
//event listener
client.on("error", (error) => {
  console.log(`Redis client error ${error}`);
});

async function testRedisConnection() {
  try {
    //connect to redis
    await client.connect();
    console.log(`connected to redis`);
    //set value
    await client.set("name", "hiral");
    //get Value
    const extractValue = await client.get("name");
    console.log(extractValue);
    //delete value
    const deleteCount = await client.del("name");
    console.log(deleteCount);

    const extractUpdatevalue = await client.get("name");
    console.log(extractUpdatevalue);
    await client.set("count", "100");
    //ince value
    const incrementCount = await client.incr("count");
    console.log(incrementCount);
    //decr value
    const decrementCount = await client.decr("count");
    console.log(decrementCount);
  } catch (err) {
    console.error(error);
  } finally {
    await client.quit();
  }
}
testRedisConnection();
