const apiRouter = require("./api/apiRouter");


function route(app) {
  app.use("/api", apiRouter);
  
}

module.exports = route;
