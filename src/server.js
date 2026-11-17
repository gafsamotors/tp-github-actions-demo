import http from "node:http";
import { pathToFileURL } from "node:url";

import { messageAccueil, salutation } from "./hello.js";

function envoyer(reponse, code, donnees) {
  const corps = JSON.stringify(donnees);
  reponse.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(corps)
  });
  reponse.end(corps);
}

export function creerServeur() {
  return http.createServer((requete, reponse) => {
    const url = new URL(requete.url, "http://localhost");

    if (url.pathname === "/health") {
      return envoyer(reponse, 200, { status: "UP", service: "hello-actions" });
    }

    if (url.pathname === "/salutation") {
      const nom = url.searchParams.get("nom") ?? "ISET Gafsa";
      return envoyer(reponse, 200, { message: salutation(nom) });
    }

    if (url.pathname === "/") {
      return envoyer(reponse, 200, messageAccueil());
    }

    return envoyer(reponse, 404, { error: "Route inconnue" });
  });
}

const estPrincipal =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (estPrincipal) {
  const port = Number(process.env.PORT ?? 3000);
  creerServeur().listen(port, () => {
    console.log("hello-actions écoute sur http://localhost:" + port);
  });
}