const Store = require("git-content/Store");
const Model = require("git-content/Model");
const fs = require("fs");
const Path = require("path");
const merge = require("lodash.merge");
const crypter = require("./encryption");

const getConfig = (config = {}) => {
  let configFile = {};
  try {
    configFile = fs.readFileSync(
      Path.join(process.cwd(), ".git-vault.json"),
      "utf-8"
    );
    configFile = JSON.parse(configFile);
  } catch (error) {}

  return merge(configFile, config);
};

const exitWith = (message, code = 0) => {
  if (message && code == 0) console.log(message);
  if (message && code != 0) console.error("Error:", message);
  process.exit(code);
};

const getModel = ({ owner, repo, auth, branch }, path) => {
  const store = new Store({ owner, repo, auth, branch });
  const model = new Model(store, path);

  return model;
};

const getRemoteConfig = async (argv, isInit = true) => {
  argv = getConfig(argv);

  if (!argv["env"]) {
    argv["env"] = process.env.NODE_ENV || "default";
  }

  if (!argv["auth"]) {
    argv["auth"] = process.env.GITHUB_KEY;
  }

  if (!argv["auth"]) {
    argv["auth"] = fs.readFileSync(
      Path.join(process.cwd(), ".github.key"),
      "utf-8"
    );
  }

  if (!argv["encryption-key"]) {
    argv["encryption-key"] = process.env.ENCRYPTION_KEY;
  }

  if (!argv["encryption-key"]) {
    argv["encryption-key"] = fs.readFileSync(
      Path.join(process.cwd(), ".git-vault.key"),
      "utf-8"
    );
  }
  const { owner, repo, auth, branch } = argv;
  const path = `${argv.project}/${argv.env}.json`;
  if (argv.v) console.log({ argv, path });
  let config = {};
  const model = getModel({ owner, repo, auth, branch }, path);
  try {
    let { text } = await model.init(isInit);
    text = crypter.decrypt(text, argv["encryption-key"]);
    config = JSON.parse(text);
  } catch (error) {
    if (isInit === false) throw error;
    if (argv.v) console.log(error);
  }

  return { config, model, args: argv };
};

const updateRemoteConfig = async (args, model, data) => {
  data = JSON.stringify(data);
  await model.save(crypter.encrypt(data, args["encryption-key"]));
};

const add = async (argv) => {
  try {
    let { args, model, config } = await getRemoteConfig(argv);
    const { value, key } = args;
    config[key] = value;
    await updateRemoteConfig(args, model, config);

    exitWith("Added!");
  } catch (error) {
    console.log(error);
    exitWith(error.message, 1);
  }
};

const get = async (argv) => {
  try {
    let { config, args } = await getRemoteConfig(argv, false);
    const { key } = args;
    exitWith(config[key]);
  } catch (error) {
    exitWith(error.message, 1);
  }
};

const all = async (argv) => {
  try {
    let { config } = await getRemoteConfig(argv, false);
    exitWith(config);
  } catch (error) {
    exitWith(error.message, 1);
  }
};

const remove = async (argv) => {
  try {
    let { config, model, args } = await getRemoteConfig(argv);
    const { key } = args;
    delete config[key];
    await updateRemoteConfig(args, model, config);
    exitWith("Removed!");
  } catch (error) {
    exitWith(error.message, 1);
  }
};

module.exports = { add, get, remove, all, getRemoteConfig };
