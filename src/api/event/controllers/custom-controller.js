// path: ./src/api/hello/controllers/hello.js

const utils = require("../../../utils");
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // Method 2: Wrapping a core action (leaves core logic in place)
  test(ctx) {
    ctx.body = ctx.params.testId;
  },
  async upload(ctx) {
    const { id: imageId } = ctx.query || {};
    if (!imageId) {
      ctx.badRequest(`image id query params not provided`);
      return;
    }

    const { refId: eventId } = ctx.request.body;

    if (!eventId) {
      ctx.badRequest(`refId body value not provided`);
      return;
    }

    const ownerEntry = await utils.isOwnerPolicy(ctx, eventId);
    if (!ownerEntry) {
      return;
    }

    const uploadController = strapi.controller("plugin::upload.content-api");
    // the query should be empty so we are not executing the default replaceFile
    ctx.query = {};
    try {
      await uploadController.destroy({
        ...ctx,
        params: { id: imageId },
        notFound: (msg) => {
          ctx.notFound(msg);
        },
      });
    } catch (error) {
      ownerEntry.image = null;
      await strapi.entityService.update("api::event.event", ownerEntry.id, {
        data: ownerEntry,
      });
    }
    try {
      // now the image is deleted, we can upload the new Image
      const uploadedFile = await uploadController.upload(ctx);
      return uploadedFile;
    } catch (error) {
      ctx.badRequest(error?.message || "something went wrong");
      return;
    }
  },
  async userEvents(ctx) {
    const { user } = ctx.state;
    if (!user) {
      ctx.unauthorized("no bearer token was found");
      return;
    }
    const { populate, ...filters } = ctx.query;
    const populateQuery = populate ? { populate } : {};
    const entries = await strapi.entityService.findMany("api::event.event", {
      ...populateQuery,
      filters: {
        $and: [
          {
            user: { username: user.username },
          },
        ],
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entries, ctx);
    const result = this.transformResponse(sanitizedEntity);
    return result;
  },
}));
