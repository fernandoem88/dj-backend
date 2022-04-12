module.exports = {
  routes: [
    {
      method: "GET",
      path: "/test/:testId",
      handler: "custom-controller.test",
      config: {
        auth: false, // if false => then it's a public route
      },
    },
    {
      method: "PUT",
      path: "/upload",
      handler: "custom-controller.upload",
      config: {
        auth: false, // if false => then it's a public route
      },
    },
    {
      method: "GET",
      path: "/user-events",
      handler: "custom-controller.userEvents",
      config: {
        // auth: false, // if false => then it's a public route
        // policies: ["is-authenticated"],
      },
    },
  ],
};
