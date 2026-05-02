//publisber ->Send ->channel->subscriber will consume it
import redis from "redis";

const client = redis.createClient({
  host: "localhost", //redis server is hosted on localhost
  port: 6379, //default redis port
});
//event listener
client.on("error", (error) => {
  console.log(`Redis client error ${error}`);
});

async function testAdditionalFeatures() {
  try {
    await client.connect();
    console.log(`connected to redis`);

    const subscriber = client.duplicate(); //create a new client and share same connection
    await subscriber.connect(); //connect to redis server for the subscriber

    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Received message from ${channel}:${message}`);
    });

    //publish message to dummy channel
    await client.publish("dummy-channel", "Some dummy data from publisher");
    await client.publish("dummy-channel", "new dummy data from publisher");

    await new Promise((resolve) => setTimeout(resolve, 3000));
    await subscriber.unsubscribe("dummy-channel");
    await subscriber.quit(); //close the subscriber

    //pipelining & transition
    //sending multiple commands to redis server in batch
    //banking appplication money from one account to another account, one operatin to fail and another to succeed
    // const multi = client.multi();
    // multi.set("key-transcation1", "value1");
    // multi.set("key-transcation2", "value2");
    // multi.get("key-transcation1");
    // multi.get("key-transcation2");
    // const results = await multi.exec();
    // console.log(results);

    // const pipeline = client.multi();
    // multi.set("key-pipeline1", "value1");
    // multi.set("key-pipeline2", "value2");
    // multi.get("key-pipeline1");
    // multi.get("key-pipeline2");
    // const pipelineresults = await multi.exec();
    // console.log(pipelineresults);

    // //batch data operation
    // const pipelineOne = client.multi();
    // for (i = 0; i < 1000; i++) {
    //   pipeline.set(`user:${i}:action`, `Action ${1}`);
    // }
    // await pipelineOne.exec();

    // const dummyExample = await client.multi();
    // multi.decrBy("account:1234:balance", 100);
    // multi.incrBy("account:0000:balance", 100);
    // const finalresults = await multi.exec();

    // const cartEaxmnple = client.multi();
    // multi.hIncrBy("cart:1234", "item_count", 1);
    // multi.hIncrBy("cart:1234", "item_price", 10);
    // await multi.exec();
    console.log("performance test");
    console.time("without pipeline");
    for (let i = 0; i < 1000; i++) {
      await client.set(`user${i}`, `user_value${1}`);
    }
    console.timeEnd("without pipeline");

    console.time("with pipeline");
    const bigPipelint = client.multi();
    for (let i = 0; i < 1000; i++) {
      await bigPipelint.set(`user_pipelinet${i}`, `user_pipeline_value${1}`);
    }
    await bigPipelint.exec();
    console.timeEnd("with pipeline");
  } catch (e) {
    console.error(e);
  } finally {
    await client.quit();
  }
}
testAdditionalFeatures();
