import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.join(RACINE, "resultats", "junit.xml");

const run = spawnSync(
  process.execPath,
  ["--test-reporter=tap", "--test"],
  { cwd: RACINE, encoding: "utf8" }
);

const sortie = (run.stdout || "") + (run.stderr || "");
const cas = [];
let courant = null;

for (const ligne of sortie.split("\n")) {
  const debut = ligne.match(/^ok \d+ - (.+)$/);
  const echec = ligne.match(/^not ok \d+ - (.+)$/);
  if (debut || echec) {
    courant = { nom: (debut || echec)[1].trim(), ok: Boolean(debut), duree: 0 };
    cas.push(courant);
    continue;
  }
  const duree = ligne.match(/^\s+duration_ms:\s*([\d.]+)/);
  if (duree && courant) {
    courant.duree = Number(duree[1]) / 1000;
  }
}

const echecs = cas.filter((c) => !c.ok).length;
const dureeTotale = cas.reduce((somme, c) => somme + c.duree, 0).toFixed(3);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<testsuites name="hello-actions" tests="' + cas.length + '" failures="' + echecs + '" time="' + dureeTotale + '">',
  '  <testsuite name="hello-actions" tests="' + cas.length + '" failures="' + echecs + '" time="' + dureeTotale + '">'
]
  .concat(
    cas.map((c) =>
      [
        '    <testcase classname="hello-actions" name="' + c.nom.replace(/"/g, "&quot;") + '" time="' + c.duree.toFixed(3) + '">',
        c.ok ? null : "      <failure message=\"Le test a echoue\"/>",
        "    </testcase>"
      ]
        .filter(Boolean)
        .join("\n")
    )
  )
  .concat(["  </testsuite>", "</testsuites>", ""])
  .join("\n");

mkdirSync(path.dirname(SORTIE), { recursive: true });
writeFileSync(SORTIE, xml, "utf8");

console.log(cas.length + " tests, " + echecs + " echec(s)");
console.log("Rapport JUnit ecrit dans resultats/junit.xml");
process.exit(run.status ?? 1);