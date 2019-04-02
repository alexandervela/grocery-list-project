const listQueries = require("../db/queries.lists.js");
const Authorizer = require("../policies/application");

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
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render("lists/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/lists");
    }
  },
  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newList = {
        title: req.body.title,
        private: req.body.title,
        userId: req.user.id
      };
      listQueries.addList(newList, (err, list) => {
        if(err){
          res.redirect(500, "/lists/new");
        } else {
          res.redirect(303, `/lists/${list.id}`);
        }
      });
    } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/lists");
    }
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
    listQueries.deleteList(req, (err, list) => {
      if(err){
        res.redirect(err, `/lists/${list.id}`)
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
        const authorized = new Authorizer(req.user, list).edit();
        if(authorized){
          res.render("lists/edit", {list});
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/lists/${req.params.id}`)
        }
      }
    });
  },
  update(req, res, next){
    listQueries.updateList(req, req.body, (err, list) => {
      if(err || list == null){
        res.redirect(401, `/lists/${req.params.id}/edit`);
      } else {
        res.redirect(`/lists/${req.params.id}`);
      }
    });
  }
}
