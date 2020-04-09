# git-vault

store keys safely inside a remote git repositories (private).
(best use in open source project)

## Installing

```bash
npm i -g git-vault
```

### USAGE

```bash
git-vault help
```

```bash
cd project-folder
git-vault init
git-vault add --key="test-key" --value="secret"
git-vault all
```

environment variable supported: ENCRYPTION_KEY, GITHUB_KEY, NODE_ENV

### Example

```bash
npm i git-vault express
```

```js
//express app
const express = require("express");
const gitVault = require("git-vault");
const app = express();

app.use((req, res, done) => {
  gitVault()
    .then((env) => (req.env = env))
    .finally(() => done());
});

app.use("/", (req, res) => res.json({ test: "site", env: req.env }));

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`running on port ${port}!`);
});
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
