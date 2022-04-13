module.exports = ({ env }) => {
  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_SECRET"),
          default_folder: "dj-events", //env('CLOUDINARY_DEFAULT_FOLDER'),
        },
        // actionOptions: {
        //   upload: {
        //     folder: "dj-events",
        //   },
        //   delete: {},
        // },
      },
    },
  };
};
