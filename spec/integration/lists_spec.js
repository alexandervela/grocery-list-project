const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists/";
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("routes : lists", () => {

  beforeEach((done) => {
    this.list;
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
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    });

  });

  describe("a user performing CRUD actions", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member"
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("GET /lists", () => {

      it("should return a status code 200 and all lists", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Lists");
          expect(body).toContain("Grocery List");
          done();
        });
      });
  
    });
  
    describe("GET /lists/new", () => {
  
      it("should render a new list form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New List");
          done();
        });
      });
  
    });
  
    describe("POST /lists/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Grocery List",
          private: false,
          userId: this.user.id
        }
      };
  
      it("should create a new list and redirect", (done) => {
        request.post(options,
          (err, res, body) => {
            List.findOne({where: {title: "Grocery List"}})
            .then((list) => {
              expect(res.statusCode).toBe(303);
              expect(list.title).toBe("Grocery List");
              expect(list.private).toBe(false);
              expect(list.userId).toBe(this.user.id);
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
  
    describe("GET /lists/:id", () => {
  
      it("should render a view with the selected list", (done) => {
        request.get(`${base}${this.list.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Grocery List");
          done();
        });
      });
  
    });
  
    describe("POST /lists/:id/destroy", () => {
  
      it("should delete the list with the associated ID", (done) => {
        List.all()
        .then((lists) => {
          const listCountBeforeDelete = lists.length;
          expect(listCountBeforeDelete).toBe(1);
          request.post(`${base}${this.list.id}/destroy`, (err, res, body) => {
            List.all()
            .then((lists) => {
              expect(err).toBeNull();
              expect(lists.length).toBe(listCountBeforeDelete - 1);
              done();
            })
          });
        });
  
      });
  
    });
  
    describe("GET /lists/:id/edit", () => {
  
      it("should render a view with an edit list form", (done) => {
        request.get(`${base}${this.list.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit List");
          expect(body).toContain("Grocery List");
          done();
        });
      });
  
    });
  
    describe("POST /lists/:id/update", () => {
  
      it("should update the list with the given values", (done) => {
         const options = {
            url: `${base}${this.list.id}/update`,
            form: {
              title: "Walmart List",
              private: false,
              userId: this.user.id
            }
          };
          request.post(options,
            (err, res, body) => {
            expect(err).toBeNull();
  
            List.findOne({
              where: { id: this.list.id }
            })
            .then((list) => {
              expect(list.title).toBe("Walmart List");
              expect(list.private).toBe(false);
              expect(list.userId).toBe(this.user.id);
              done();
            });
          });
      });
  
    });
  
  });

});
