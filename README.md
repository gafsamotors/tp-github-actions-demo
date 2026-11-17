# hello-actions

Projet minimal du TP GitHub Actions - ISET Gafsa.

- `src/hello.js` : fonction de salutation.
- `src/server.js` : serveur HTTP sans dependance (`/`, `/health`, `/salutation`).
- `test/` : tests unitaire, integration et fumee avec `node:test`.
- `.github/workflows/ci.yml` : premier CI (npm ci + npm test).
- `.github/workflows/ci-test.yml` : CI de test avec rapport JUnit.