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
  } catch (e) {
    console.error(e);
  } finally {
    await client.quit();
  }
}
testAdditionalFeatures();
