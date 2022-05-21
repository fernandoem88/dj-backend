module.exports = async (ctx, config, { strapi }) => {
  // 1: manager id should be passed as query => ?manager=1
  // 2: check if there is a user with that managerId and if it is a manager
  // 3: if it's a manager then proceed otherwise reject

  const { manager } = ctx.request.query || {};
  if (manager === undefined || manager === null) {
    return false;
  }
  try {
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      manager,
      { populate: "role" }
    );

    if (user.role.name === "manager") {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
