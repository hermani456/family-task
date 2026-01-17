import { webcrypto } from "node:crypto";

if (!global.crypto) {
  // @ts-ignore
  global.crypto = webcrypto;
}

import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});