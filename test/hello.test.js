import { test } from "node:test";
import assert from "node:assert/strict";

import { salutation } from "../src/hello.js";

test("salutation construit une phrase avec le prenom", () => {
  assert.equal(salutation("Ahmed"), "Bonjour Ahmed !");
});

test("salutation ignore les espaces autour du prenom", () => {
  assert.equal(salutation("  Ahmed  "), "Bonjour Ahmed !");
});

test("salutation gere un prenom vide", () => {
  assert.equal(salutation(""), "Bonjour !");
});