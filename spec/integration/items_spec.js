const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists";
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("routes : items", () => {

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
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });

  describe("GET /lists/:listId/items/new", () => {

    it("should render a new item form", (done) => {
      request.get(`${base}/${this.list.id}/items/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Item");
        done();
      });
    });

  });

  describe("POST /lists/:listId/items/create", () => {

    it("should create a new item and redirect", (done) => {
       const options = {
         url: `${base}/${this.list.id}/items/create`,
         form: {
           name: "Bananas",
           price: 1.99
         }
       };
       request.post(options,
         (err, res, body) => {
 
           Item.findOne({where: {name: "Bananas"}})
           .then((item) => {
             expect(item).not.toBeNull();
             expect(item.name).toBe("Bananas");
             expect(item.price).toBe(1.99);
             expect(item.listId).not.toBeNull();
             done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
         }
       );
     });

     it("should not create a new item that fails validations", (done) => {
      const options = {
        url: `${base}/${this.list.id}/items/create`,
        form: {
          name: "a"
        }
      };
  
      request.post(options,
        (err, res, body) => {
          Item.findOne({where: {name: "a"}})
          .then((post) => {
              expect(post).toBeNull();
              done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
 
  });

  describe("POST /lists/:listId/items/:id/destroy", () => {

    it("should delete the item with the associated ID", (done) => {
      
      Item.all()
      .then((items) => {
        const itemCountBeforeDelete = items.length;
        expect(itemCountBeforeDelete).toBe(1);
        request.post(`${base}/${this.list.id}/items/${this.item.id}/destroy`, (err, res, body) => {
          Item.all()
          .then((items) => {
            expect(err).toBeNull();
            expect(items.length).toBe(itemCountBeforeDelete - 1);
            done();
          })
        });
      });

    });

  });

  describe("GET /lists/:listId/items/:id/edit", () => {

    it("should render a view with an edit item form", (done) => {
      request.get(`${base}/${this.list.id}/items/${this.item.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Item");
        expect(body).toContain("Apples");
        done();
      });
    });

  });

  describe("POST /lists/:listId/items/:id/update", () => {

    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.list.id}/items/${this.item.id}/update`,
        form: {
          name: "Orange",
          price: 1.05
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the item with the given values", (done) => {
        const options = {
          url: `${base}/${this.list.id}/items/${this.item.id}/update`,
          form: {
            name: "Orange",
            price: 2.05
          }
        };
        request.post(options,
          (err, res, body) => {

          expect(err).toBeNull();

          Item.findOne({
            where: {id: this.item.id}
          })
          .then((item) => {
            expect(item.name).toBe("Orange");
            expect(item.price).toBe(2.05);
            done();
          });
        });
    });

  });

});