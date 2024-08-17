import mqtt from "mqtt";
import {
  Observable,
  ReplaySubject,
  retry,
  share,
  switchMap,
  takeUntil,
} from "rxjs";
import { charge_channel_series_items, devices as dbDevices } from "../db/schema.ts";
import { config } from "./config.ts";
import { db } from "./db.ts";
import { exit$ } from "./shared.ts";

const client = mqtt.connect(config.MQTT_URL);
client.on("connect", () => {
  client.subscribe(`${config.MQTT_PREFIX}#`);
  console.log("Connected to MQTT broker");
});

type MQTTMessageItem = {
  topic: string;
  message: Buffer;
  timestamp: number;
};
const messagesSubject = new ReplaySubject<MQTTMessageItem>(
  config.MQTT_BUFFER_SIZE,
);

client.on("message", (rawTopic, message) => {
  const topic = rawTopic.replace(config.MQTT_PREFIX, "");
  console.log(`Received message on topic ${topic}: ${message.toString("hex")}`);
  messagesSubject.next({ topic, message, timestamp: Date.now() });
});

type ChargeChannelSeriesItem = {
  deviceId: string;
  channel: number;
  timestamp: number;
  values: Buffer;
};

const parsedChannelSeriesItem$ = new Observable<ChargeChannelSeriesItem>(
  (subscriber) => {
    const subscription = messagesSubject.subscribe((pkg) => {
      const [device, channelText, type] = pkg.topic.split("/");
      if (!channelText.startsWith("ch")) {
        return;
      }

      const channel = Number.parseInt(channelText.replace("ch", ""), 10);
      if (type !== "series") {
        return;
      }

      subscriber.next({
        deviceId: device,
        channel,
        timestamp: pkg.timestamp,
        values: pkg.message,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  },
).pipe(share(), takeUntil(exit$));

const devices = await db.query.devices.findMany();



function recordToDB() {
  parsedChannelSeriesItem$
    .pipe(
      switchMap(async (item) => {
        if (!devices.some((d) => d.id === item.deviceId)) {
          await db.insert(dbDevices).values({ id: item.deviceId, name: item.deviceId });
        }

        await db.insert(charge_channel_series_items).values(item);
      }),
      retry(5),
    )
    .subscribe({
      error: (error) => {
        console.error(error);
      }
    });
}

recordToDB();