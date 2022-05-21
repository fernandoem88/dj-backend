// this is an example of some routes extension using custom policies
module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/events/:id",
      handler: "event.update",
      config: {
        // auth: false, // if false => then it's a public route
        policies: ["is-manager"],
      },
    },
    {
      method: "DELETE",
      path: "/events/:id",
      handler: "event.delete",
      config: {
        // auth: false, // if false => then it's a public route
        policies: ["is-manager"],
      },
    },
  ],
};
