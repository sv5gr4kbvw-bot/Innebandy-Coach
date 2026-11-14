# Funktionstester

Testerna använder Node.js och jsdom 26. De kör appens befintliga JavaScript i en simulerad DOM; Firebase och skärmmått simuleras. De gör inga nätverksanrop till riktiga tränarrum och kontrollerar inte visuellt utseende.

Installera testberoendet separat från webbappen och kör exempelvis:

```sh
npm install --prefix /tmp/coach-tests jsdom@26
NODE_PATH=/tmp/coach-tests/node_modules node tests/statistics.cjs
NODE_PATH=/tmp/coach-tests/node_modules node tests/sharing.cjs
NODE_PATH=/tmp/coach-tests/node_modules node tests/runtime.cjs
NODE_PATH=/tmp/coach-tests/node_modules node tests/rotation.cjs
```
