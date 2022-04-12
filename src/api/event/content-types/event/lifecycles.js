const slugify = require("slugify");

module.exports = {
  beforeFindOne(event) {
    const { data } = event.params;
  },
  beforeCreate(event) {
    const { data } = event.params;

    if (data.name) {
      const uid = slugify(data.name);
      data.slug = uid;
    }
    if (data.userId) {
      data.user = data.userId;
    }
  },
  beforeUpdate(event) {
    const { data } = event.params;
    if (data.name) {
      const uid = slugify(data.name);
      data.slug = uid;
    }
  },
};
