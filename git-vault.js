#!/usr/bin/env node
const Yargs = require("yargs"); // eslint-disable-line
const lib = require("./lib");

Yargs.usage("git-vault [cmd]");

Yargs.command(
  "init",
  "init git vault.",
  (yargs) => {},
  async (argv) => {
    lib.init(argv);
  }
);

Yargs.command(
  "add",
  "add key value param.",
  (yargs) => {
    yargs.positional("key", {
      describe: "key",
      require: true,
    });
    yargs.option("value", {
      describe: "value",
      require: true,
    });
  },
  async (argv) => {
    lib.add(argv);
  }
);

Yargs.command(
  "update",
  "update key value param.",
  (yargs) => {
    yargs.positional("key", {
      describe: "key",
      require: true,
    });
    yargs.option("value", {
      describe: "value",
      require: true,
    });
  },
  async (argv) => {
    lib.add(argv);
  }
);

Yargs.command(
  "remove",
  "remove key.",
  (yargs) => {
    yargs.positional("key", {
      describe: "key",
      require: true,
    });
  },
  async (argv) => {
    lib.remove(argv);
  }
);

Yargs.command(
  "get",
  "get key.",
  (yargs) => {
    yargs.positional("key", {
      describe: "key",
      require: true,
    });
  },
  async (argv) => {
    lib.get(argv);
  }
);

Yargs.command(
  "all",
  "get all.",
  (yargs) => {},
  async (argv) => {
    lib.all(argv);
  }
);

Yargs.option("owner", {
  type: "string",
  description: "owner",
})
  .option("repo", {
    default: "config",
    type: "string",
    description: "repo",
  })
  .option("branch", {
    default: "master",
    type: "string",
    description: "branch",
  })
  .option("project", {
    type: "string",
    description: "project",
  })
  .option("env", {
    type: "string",
    description: "env",
  })
  .option("auth", {
    alias: "a",
    type: "string",
    description: "Github api key",
  })
  .option("encryption-key", {
    alias: "ek",
    type: "string",
    description: "encryption key",
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  }).argv;

if (Yargs.argv["_"].length == 0) {
  Yargs.showHelp();
}
