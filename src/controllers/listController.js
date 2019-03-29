const listQueries = require("../db/queries.lists.js");

module.exports = {
  index(req, res, next){
    listQueries.getAllLists((err, lists) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("lists/index", {lists});
      }
    })
  },
  new(req, res, next){
    res.render("lists/newList");
  },
  create(req, res, next){
    let newList = {
      title: req.body.title
    };
    listQueries.addList(newList, (err, list) => {
      if(err){
        res.redirect(500, "/lists/new");
      } else {
        res.redirect(303, `/lists/${list.id}`);
      }
    });
  },
  show(req, res, next){
    listQueries.getList(req.params.id, (err, list) => {
      if(err || list == null){
        res.redirect(404, "/");
      } else {
        res.render("lists/show", {list});
      }
    });
  },
  destroy(req, res, next){
    listQueries.deleteList(req.params.id, (err, list) => {
      if(err){
        res.redirect(500, `/lists/${list.id}`)
      } else {
        res.redirect(303, "/lists")
      }
    });
  },
  edit(req, res, next){
    listQueries.getList(req.params.id, (err, list) => {
      if(err || list == null){
        res.redirect(404, "/");
      } else {
        res.render("lists/edit", {list});
      }
    });
  },
  update(req, res, next){
    listQueries.updateList(req.params.id, req.body, (err, list) => {
      if(err || list == null){
        res.redirect(404, `/lists/${req.params.id}/edit`);
      } else {
        res.redirect(`/lists/${list.id}`);
      }
    });
  }
}
