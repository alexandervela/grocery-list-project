'use strict';
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Item.associate = function(models) {
    // associations can be defined here

    Item.belongsTo(models.List, {
      foreignKey: "listId",
      onDelete: "CASCADE"
    });

  };
  return Item;
};