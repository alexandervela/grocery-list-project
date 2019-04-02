const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("Item", () => {

  beforeEach((done) => {
    this.list;
    this.item;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "user@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

      List.create({
        title: "Grocery List",
        private: false,
        userId: this.user.id
      })
      .then((list) => {
        this.list = list;

        Item.create({
          name: "Apples",
          price: 1.05,
          listId: this.list.id,
          userId: this.user.id
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
    })
  });

  });

  describe("#create()", () => {

    it("should create a item object with a name, price, and assigned list", (done) => {
      Item.create({
        name: "Bananas",
        price: 1.99,
        purchased: false,
        listId: this.list.id,
        userId: this.user.id
      })
      .then((item) => {
        expect(item.name).toBe("Bananas");
        expect(item.price).toBe(1.99);
        expect(item.purchased).toBe(false);
        expect(item.userId).toBe(this.user.id);
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
        expect(err.message).toContain("Item.purchased cannot be null");
        expect(err.message).toContain("Item.listId cannot be null");
        expect(err.message).toContain("Item.userId cannot be null");
        done();
      })
    });

  });

  describe("#setList()", () => {

    it("should associate a list and a item together", (done) => {
      List.create({
        title: "Walmart List",
        private: false,
        userId: this.user.id,
        purchased: false,
        userId: this.user.id
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