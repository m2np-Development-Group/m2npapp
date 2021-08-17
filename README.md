# M2NP
```
npm install node-sass sass -g
npm install -g typescript
npm link typescript

```
Scripts:

```
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "start": "sirv public -s",
    "format": "prettier --write --plugin-search-dir=. --svelte-bracket-new-line false ./src/*"
  },
```