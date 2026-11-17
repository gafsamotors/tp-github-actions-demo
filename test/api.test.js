import { test } from "node:test";
import assert from "node:assert/strict";

import { creerServeur } from "../src/server.js";

async function demarrer() {
  const serveur = creerServeur().listen(0, "127.0.0.1");
  await new Promise((resolve) => serveur.once("listening", resolve));
  return serveur;
}

async function appeler(serveur, chemin) {
  const { port } = serveur.address();
  const reponse = await fetch("http://127.0.0.1:" + port + chemin);
  const corps = await reponse.json();
  return { code: reponse.status, corps };
}

test("GET /health repond 200 avec status UP", async () => {
  const serveur = await demarrer();
  const { code, corps } = await appeler(serveur, "/health");
  serveur.close();
  assert.equal(code, 200);
  assert.equal(corps.status, "UP");
});

test("GET /salutation renvoie le message attendu", async () => {
  const serveur = await demarrer();
  const { code, corps } = await appeler(serveur, "/salutation?nom=ISET");
  serveur.close();
  assert.equal(code, 200);
  assert.equal(corps.message, "Bonjour ISET !");
});

test("GET /inconnue renvoie 404", async () => {
  const serveur = await demarrer();
  const { code } = await appeler(serveur, "/inconnue");
  serveur.close();
  assert.equal(code, 404);
});