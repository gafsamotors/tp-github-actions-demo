const SEPARATEUR = " ";

export function salutation(nom) {
  const propre = String(nom ?? "").trim();
  if (!propre) {
    return "Bonjour !";
  }
  return ["Bonjour", propre].join(SEPARATEUR) + " !";
}

export function messageAccueil() {
  return {
    service: "hello-actions",
    message: salutation("ISET Gafsa")
  };
}