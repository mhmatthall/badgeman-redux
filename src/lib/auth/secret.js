import { createHash } from "crypto";

export const verify = (id, secret) => {
  return generate(id) === secret;
};

export const generate = (id) => {
  return createHash("md5").update(id).digest("hex").substring(1, 5);
};
