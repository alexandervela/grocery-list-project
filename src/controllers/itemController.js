const itemQueries = require("../db/queries.items.js");

module.exports = {
  new(req, res, next){
    res.render("items/new", {listId: req.params.listId});
  },
  create(req, res, next){
    let newItem= {
      name: req.body.name,
      price: req.body.price,
      purchased: req.body.purchased,
      listId: req.params.listId,
      userId: req.user.id
    };
    itemQueries.addItem(newItem, (err, item) => {
      if(err){
        res.redirect(500, "/items/new");
      } else {
        res.redirect(303, `/lists/${newItem.listId}`);
      }
    });
  },
  destroy(req, res, next){
    itemQueries.deleteItem(req.params.id, (err, deletedRecordsCount) => {
      if(err){
        res.redirect(500, `/lists/${req.params.listId}`)
      } else {
        res.redirect(303, `/lists/${req.params.listId}`)
      }
    });
  },
  edit(req, res, next){
    itemQueries.getItem(req.params.id, (err, item) => {
      if(err || item == null){
        res.redirect(404, "/");
      } else {
        res.render("items/edit", {item});
      }
    });
  },
  update(req, res, next){
    itemQueries.updateItem(req.params.id, req.body, (err, item) => {
      if(err || item == null){
        res.redirect(404, `/lists/${req.params.listId}/items/${req.params.id}/edit`);
      } else {
        res.redirect(`/lists/${req.params.listId}/items/${req.params.id}`);
      }
    });
  }
}