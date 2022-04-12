// path: ./src/api/hello/controllers/hello.js

// module.exports = {
//   async hello(ctx, next) {
//     // called by GET /hello
//     console.log("___keys___", Object.keys(ctx).join(", "));
//     ctx.body = "Hello World!"; // we could also send a JSON
//   },
// };
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const { createCoreController } = require("@strapi/strapi").factories;
/*

const ctx = {
    request: {method: string, url: string, header: {}},
    response: {status: number, message: string, header: {}, body?: any},
    app: any,
    req: any,
    res: any,
    params: {},
    routerPath: string,
    routerName: string,
    originalUrl: string,
    state: any,
    matched: any,
    router: any,
    _matchedRoute: any,
    captures: any,
    
}

strapi {
    db: {};
    entityService: {};
    admin: any;
    store:  any;
    app: any;
    log: any;          
    cron: any;
    dirs: any;
    container: any;
    isLoaded: boolean;       
    reload: any;
    server: any;        
    fs: any;
    eventHub: any;       
    startupLogger: any;
    telemetry: any;          
    components: any;
    webhookRunner: any;        
    webhookStore: any;
    entityValidator: any;
}
 */
module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // Method 2: Wrapping a core action (leaves core logic in place)
  test(ctx) {
    ctx.body = ctx.params.testId;
  },
  async upload(ctx) {
    // if (!ctx.state.user) {
    //   ctx.unauthorized("no bearer token found in the header");
    //   return;
    // }

    // ctx.query.id = 819978628331627;

    console.log("\nquery", ctx.query);
    console.log("\nreq body", ctx.request.body);

    const uploadController = strapi.controller("plugin::upload.content-api");
    const imageFile = await uploadController.replaceFile(ctx, (...args) => {
      console.log("\n\n---args", args);
    });
    // console.log("\n\n__imageFile", imageFile);
    return imageFile;
  },
  async userEvents(ctx) {
    // const { username } = ctx.query || {};
    const { user } = ctx.state;

    if (!user) {
      ctx.unauthorized("no bearer token was found");
      //   ctx.notFound("user not found");
      //   ctx.accessdenied("pipppo");
      //   ctx.badRequest("please check all your fields");
      return;
    }
    const { populate } = ctx.query;
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
