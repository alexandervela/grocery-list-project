const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/lists/:listId/items/new", itemController.new);
router.post("/lists/:listId/items/create", /* helper.ensureAuthenticated, */ validation.validateItems, itemController.create);
router.post("/lists/:listId/items/:id/destroy", itemController.destroy);
router.get("/lists/:listId/items/:id/edit", itemController.edit);
router.post("/lists/:listId/items/:id/update", validation.validateItems, itemController.update);

module.exports = router;