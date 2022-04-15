module.exports = ({ env }) => ({
  proxy: true,
  url: env("PROD_HEROKU_URL"),
  app: {
    keys: env.array("APP_KEYS"),
  },
});
