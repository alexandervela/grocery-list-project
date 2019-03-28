module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    const listRoutes = require("../routes/lists");

    app.use(staticRoutes);
    app.use(listRoutes);
  }
}
