const routes = require("next-routes")();

routes
  .add("/", "/home/HomePage")
  .add("/index", "/home/HomePage")
  .add("/Users", "/users/Users")
  .add("/Permissions", "/permissions/Permissions") 
  .add("/Records", "/records/Records")
module.exports = routes;
