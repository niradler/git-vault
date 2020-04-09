const { getRemoteConfig } = require("./lib");

let _data = null;

const config = async (args = {}, force = false) => {
  if (_data && !force) return _data;

  const { config: data } = await getRemoteConfig(args, false);
  _data = data;

  return _data;
};

module.exports = config;
