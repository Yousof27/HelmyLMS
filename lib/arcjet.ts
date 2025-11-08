import arcjet, { detectBot, fixedWindow, protectSignup, sensitiveInfo, shield, slidingWindow } from "@arcjet/next";
import { env } from "./env";

export { detectBot, fixedWindow, protectSignup, sensitiveInfo, shield, slidingWindow };

export default arcjet({
  key: env.ARCJET_KEY,

  // the default value is ip address
  characteristics: ["fingerprint"],

  // the basic rules
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
