module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '84bb3b5b78e3752870bba499f6404d00'),
  },
});
