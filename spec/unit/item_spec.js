const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("Item", () => {

  beforeEach((done) => {
    this.list;
    this.item;
    sequelize.sync({force: true}).then((res) => {

      List.create({
        title: "Grocery List"
      })
      .then((list) => {
        this.list = list;

        Item.create({
          name: "Apples",
          price: 1.05,
          listId: this.list.id
        })
        .then((item) => {
          this.item = item;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#create()", () => {

    it("should create a item object with a name, price, and assigned list", (done) => {
      Item.create({
        name: "Bananas",
        price: 1.99,
        listId: this.list.id
      })
      .then((item) => {
        expect(item.name).toBe("Bananas");
        expect(item.price).toBe(1.99);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create an item with missing name, price, or assigned list", (done) => {
      Item.create({
        name: "Walmart List"
      })
      .then((item) => {
       // the code in this block will not be evaluated since the
       // validation error will skip it.
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Item.price cannot be null");
        expect(err.message).toContain("Item.listId cannot be null");
        done();
      })
    });

  });

  describe("#setList()", () => {

    it("should associate a list and a item together", (done) => {
      List.create({
        title: "Walmart List"
      })
      .then((newList) => {
        expect(this.item.listId).toBe(this.list.id);
        this.item.setList(newList)
        .then((item) => {
          expect(item.listId).toBe(newList.id);
          done();

        });
      })
    });

  });

  describe("#getList()", () => {

    it("should return the associated list", (done) => {
      this.item.getList()
      .then((associatedList) => {
        expect(associatedList.title).toBe("Grocery List");
        done();
      });
    });

  });

});