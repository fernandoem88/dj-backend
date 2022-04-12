"use strict";

/**
 *  event controller
 */

const utils = require("../../../utils");

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

const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::event.event", ({ strapi }) => {
  return {
    async create(ctx) {
      const isAuthenticated = isAuthenticatedPolicy(ctx);
      if (!isAuthenticated) return;

      // this userId qill be used in the beforeCreate hook to update
      // the user-event owner relation.
      const { data } = ctx.request.body;
      data.userId = ctx.state.user.id;
      const createdEntry = await super.create(ctx);
      return createdEntry;
    },
    async update(ctx) {
      const { id } = ctx.params || {};
      const isOwner = await isOwnerPolicy(ctx, id);

      if (!isOwner) return;

      const { data } = ctx.request.body;
      // clearing some update we dont want
      delete data.user;
      delete data.image;
      const entry = await super.update(ctx);
      return entry;
    },
    async delete(ctx) {
      const { id } = ctx.params || {};

      const ownerEntry = await isOwnerPolicy(ctx, id);
      if (!ownerEntry) return;
      // search, upload, uploadFiles, replaceFile, destroy, find, findOne
      const imageId = ownerEntry?.image?.id;
      if (imageId) {
        // delete entry and its relative image from cloudinary
        const uploadController = strapi.controller(
          "plugin::upload.content-api"
        );

        try {
          await uploadController.destroy({
            ...ctx,
            params: { id: imageId },
            notFound: () => {
              //
            },
          });
        } catch (error) {}
      }

      const entry = await strapi.entityService.delete("api::event.event", id);
      return utils.normalizeResult(this, ctx, entry);
    },
  };
});
