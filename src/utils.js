const normalizeResult = async (This, ctx, entry) => {
  const sanitizedEntity = await This.sanitizeOutput(entry, ctx);
  const result = This.transformResponse(sanitizedEntity);
  return result;
};

const isAuthenticatedPolicy = (ctx) => {
  if (!ctx.state.user) {
    ctx.unauthorized("no bearer token found in the header");
    return false;
  }
  return true;
};

const isOwnerPolicy = async (ctx, eventId) => {
  const isAuthenticated = isAuthenticatedPolicy(ctx);
  if (!isAuthenticated) return;

  const entry = await strapi.entityService.findOne(
    "api::event.event",
    eventId,
    { populate: "*" }
  );

  if (!entry) {
    ctx.notFound(`event with id ${eventId} not found!`);
    return;
  }

  if (entry.user?.id !== ctx.state.user.id) {
    ctx.unauthorized("you don't have right access to execute this operation");
    return;
  }

  return entry;
};

module.exports = {
  normalizeResult,
  isOwnerPolicy,
  isAuthenticatedPolicy,
};
