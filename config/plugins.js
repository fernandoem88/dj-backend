module.exports = ({ env }) => {
  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_SECRET"),
        },
        actionOptions: {
          upload: {
            folder: "dj-events",
          },
          delete: {},
        },
      },
    },
  };
};
