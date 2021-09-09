# M2NP
```
npm install node-sass sass -g
npm install -g typescript
npm link typescript
https://use.fontawesome.com/releases/v5.15.4/fontawesome-free-5.15.4-web.zip
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