var config = {
  // mongoDbUrl : 'mongodb://localhost:27017/apmc_yard_db',
  mongoDbUrl : 'mongodb://apmc_admin:admin@ds133547.mlab.com:33547/apmcyard_db',
  rolesAllowed : ['admin','owner'],
  shopPageLimit : 4,
  userPageLimit : 2
};

module.exports = config;
