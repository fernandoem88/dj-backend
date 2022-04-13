module.exports = (plugin) => {
  //   extending the upload plugin
  //   const contentApiController = plugin.controllers["content-api"];
  //   contentApiController.replaceEventFile = async (ctx) => {
  //     console.log("replace Event file");
  //     ctx.params = {
  //       id: ctx.query.id,
  //     };
  //     ctx.query = {};
  //     contentApiController.destroy(ctx);
  //     contentApiController.upload(ctx);
  //   };

  //   const { routes } = plugin.routes["content-api"];

  //   routes.push({
  //     method: "PUT",
  //     path: "/",
  //     handler: "content-api.replaceEventFile",
  //     config: {
  //       // auth: false, // if false => then it's a public route
  //       // policies: ["is-authenticated"],
  //     },
  //   });

  //   routes.forEach((r) => console.log(r));

  return plugin;
};
