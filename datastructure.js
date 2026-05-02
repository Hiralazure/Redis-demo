import redis from "redis";

const client = redis.createClient({
  host: "localhost", //redis server is hosted on localhost
  port: 6379, //default redis port
});
//event listener
client.on("error", (error) => {
  console.log(`Redis client error ${error}`);
});

async function redisDataStructure() {
  try {
    await client.connect();
    console.log(`connected to redis`);

    //string ->set,get,Mset(multiple key value),MGET
    await client.set("user:name", "Hiral");
    const name = await client.get("user:name");
    //console.log(name);
    await client.mSet([
      "user:email",
      "test@test.com",
      "user:age",
      "60",
      "user:country",
      "ewer",
    ]);
    const [email, age, country] = await client.mGet([
      "user:email",
      "user:age",
      "user:country",
    ]);
    //console.log(email, age, country);

    //list ->LPUSH,RPUSH,LRANAGE,LPOP,RPOP
    await client.lPush("notes", ["note 1", "note 2", "note 3"]);
    const extractAllNotes = await client.lRange("notes", 0, -1);
    //console.log(extractAllNotes);
    const firstElement = await client.lPop("notes");
    // console.log(firstElement);
    const remainingElement = await client.lRange("notes", 0, -1);
    //console.log(remainingElement)

    //sets -> SADD,SMEMBERS,SISMEMBER,SREM
    await client.SADD("user:nickname", ["jojn", "vyx", "ddd"]);
    const extractusernickname = await client.sMembers("user:nickname");
    // console.log(extractusernickname);
    const isNickname = await client.sIsMember("user:nickname", "jojn");
    //console.log(isNickname);
    const removeNickname = await client.SREM("user:nickname", "jojn");
    //console.log(removeNickname);
    const updatedusernickname = await client.sMembers("user:nickname");
    //console.log(updatedusernickname);

    //sorted set //ZADD,ZRANGE,ZRANK,ZREM
    await client.zAdd("cart", [
      { score: 100, value: "Cart 1" },
      { score: 150, value: "Cart 2" },
      { score: 10, value: "Cart 3" },
    ]);
    const getTopCardItems = await client.zRange("cart", 0, -1);
    //console.log(getTopCardItems);
    const extractAllCartITemsWithScors = await client.zRangeWithScores(
      "cart",
      0,
      -1,
    );
    //console.log(extractAllCartITemsWithScors);
    const cartTwoRank = await client.zRank("cart", "Cart 2");
    //console.log(cartTwoRank);

    //hashes->HSET,HGET,HGETALL,HDEL
    await client.hSet("product:1", {
      name: "product1",
      description: "description",
      rating: "5",
    });
    const getPRoductRating = await client.hGet("product:1", "rating");
    console.log(getPRoductRating);
    const getPRoductDetails = await client.hGetAll("product:1");
    console.log(getPRoductDetails);
   await client.hDel('product:1','rating')
     const getUpdatedPRoductDetails = await client.hGetAll("product:1");
     console.log(getUpdatedPRoductDetails);
  } catch (e) {
    console.error(e);
  }
}
redisDataStructure();
