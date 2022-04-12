const normalizeResult = async (This, ctx, entry) => {
  const sanitizedEntity = await This.sanitizeOutput(entry, ctx);
  const result = This.transformResponse(sanitizedEntity);
  return result;
};

module.exports = {
  normalizeResult,
};
