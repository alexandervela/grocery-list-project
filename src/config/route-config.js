module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    const listRoutes = require("../routes/lists");
    const itemRoutes = require("../routes/items");

    app.use(staticRoutes);
    app.use(listRoutes);
    app.use(itemRoutes);
  }
}
