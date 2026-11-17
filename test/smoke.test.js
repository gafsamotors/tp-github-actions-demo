import { test } from "node:test";
import assert from "node:assert/strict";

import { creerServeur } from "../src/server.js";

test("smoke : le service demarre et repond sur /", async () => {
  const serveur = creerServeur().listen(0, "127.0.0.1");
  await new Promise((resolve) => serveur.once("listening", resolve));
  const { port } = serveur.address();

  const reponse = await fetch("http://127.0.0.1:" + port + "/");
  const corps = await reponse.json();
  serveur.close();

  assert.equal(reponse.status, 200);
  assert.equal(corps.service, "hello-actions");
});