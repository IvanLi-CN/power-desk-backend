import { config } from './config.ts';

const topicMapping = [
  ["temperature", "temperature"],
  ["series", "series"],
] as const;

export type Topic = (typeof topicMapping)[number][0];

export const getDeviceTopic = (deviceId: string, topic: Topic) => {
  const value = topicMapping.find((t) => t[0] === topic);
  if (!value) {
    throw new Error(`Invalid topic: ${topic}`);
  }
  return `{config.MQTT_PREFIX}${deviceId}/${value[1]}`;
};

export const getDeviceTopicWithChannel = (
  deviceId: string,
  topic: Topic,
  channel: number,
) => {
  const value = topicMapping.find((t) => t[0] === topic);
  if (!value) {
    throw new Error(`Invalid topic: ${topic}`);
  }
  return `${config.MQTT_PREFIX}${deviceId}/ch${channel}/${value[1]}`;
};

export const parseChannelFromTopic = (topic: string) =>
  Number.parseInt(topic.split("/").slice(-2)[0].replace("ch", ""), 10);
