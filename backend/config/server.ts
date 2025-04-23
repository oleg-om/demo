export default ({ env }) => {
  return {
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    app: {
      keys: env.array("APP_KEYS"),
    },
    ...(env("NODE_ENV") !== "development" && {
      url: env("PUBLIC_URL"),
      admin: {
        url: "/strapi/admin",
        serveAdminPanel: true,
      },
    }),
  };
};
