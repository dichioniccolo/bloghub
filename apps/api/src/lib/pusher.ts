import PusherServer from "pusher";

export const pusherServer = new PusherServer({
  appId: "",
  key: "",
  secret: "",
  cluster: "eu",
  useTLS: true,
});

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
