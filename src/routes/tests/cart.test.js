const request = require("supertest");
const app = require("../../app");

const { cartOne, setupDB } = require("./db");

beforeAll(setupDB);

describe("Generating Cart ID", () => {
    test("Should Generate Unique Cart ID", async () => {
        const response = await request(app)
            .get("/shoppingCart/generateUniqueId")
            .expect(201);

        expect(response.body.data).not.toBeNull();
        expect(response.body.data).toHaveProperty("cart_id");
    });
});

describe("ADDING items in Cart", () => {
    test("Should ADD items in Cart", async () => {
        const response = await request(app)
            .post("/shoppingCart/add")
            .send({
                cart_id: cartOne.cart_id,
                product_id: 5,
                quantity: 2,
            })
            .expect(201);

        expect(response.body.data).not.toBeNull();
        expect(response.body.data.cart_id).toEqual(cartOne.cart_id);
        expect(response.body.data.product_id).toEqual(5);
        expect(response.body.data.quantity).toEqual(2);
    });

    test("Should NOT ADD items in Cart (Product does not exist in DB)", async () => {
        const response = await request(app)
            .post("/shoppingCart/add")
            .send({
                cart_id: cartOne.cart_id,
                product_id: 125, //Not existing
                quantity: 2,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });

    test("Should NOT ADD items in Cart (Cart does not exist)", async () => {
        const response = await request(app)
            .post("/shoppingCart/add")
            .send({
                cart_id: cartOne.cart_id + "3",
                product_id: 5,
                quantity: 2,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });
});

describe("UPDATING Products in Cart", () => {
    test("Should UPDATE items in Cart", async () => {
        const response = await request(app)
            .put("/shoppingCart/update")
            .send({
                cart_id: cartOne.cart_id,
                product_id: 5,
                quantity: 10,
            })
            .expect(200);

        expect(response.body.data).not.toBeNull();
    });

    test("Should NOT UPDATE items in Cart (Product does not exist in DB)", async () => {
        const response = await request(app)
            .put("/shoppingCart/update")
            .send({
                cart_id: cartOne.cart_id,
                product_id: 125, //Not existing
                quantity: 2,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });

    test("Should NOT UPDATE items in Cart (Product does not exist in Cart)", async () => {
        const response = await request(app)
            .put("/shoppingCart/update")
            .send({
                cart_id: cartOne.cart_id,
                product_id: 10, //Not existing
                quantity: 2,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });

    test("Should NOT UPDATE items in Cart (Cart does not exist)", async () => {
        const response = await request(app)
            .put("/shoppingCart/update")
            .send({
                cart_id: cartOne.cart_id + "3",
                product_id: 5,
                quantity: 2,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });
});

describe("GET total amount of Cart", () => {
    test("Should GET total amount in Cart", async () => {
        const response = await request(app)
            .get("/shoppingCart/totalAmount/" + cartOne.cart_id)
            .expect(200);
        expect(response.body.data).not.toBeNull();
        expect(response.body.data).toHaveProperty("cart_total");
    });

    test("Should NOT GET total amount in Cart", async () => {
        const response = await request(app)
            .get("/shoppingCart/totalAmount/" + cartOne.cart_id + "3")
            .expect(400);
        expect(response.body.data).toBeNull();
    });
});

describe("REMOVE Product from Cart", () => {
    test("Should REMOVE Product from Cart", async () => {
        const response = await request(app)
            .delete("/shoppingCart/removeProduct/")
            .send({
                cart_id: cartOne.cart_id,
                product_id: 5,
            })
            .expect(200);

        expect(response.body.data).not.toBeNull();
    });

    test("Should NOT REMOVE Product from Cart (Cart does not exist)", async () => {
        const response = await request(app)
            .delete("/shoppingCart/removeProduct/")
            .send({
                cart_id: cartOne.cart_id + "3",
                product_id: 5,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });

    test("Should NOT REMOVE Product from Cart (Product does not exist in Cart)", async () => {
        const response = await request(app)
            .delete("/shoppingCart/removeProduct/")
            .send({
                cart_id: cartOne.cart_id + "3",
                product_id: 6,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });

    test("Should NOT REMOVE Product from Cart (Product does not exist in DB)", async () => {
        const response = await request(app)
            .delete("/shoppingCart/removeProduct/")
            .send({
                cart_id: cartOne.cart_id + "3",
                product_id: 123,
            })
            .expect(400);

        expect(response.body.data).toBeNull();
    });
});

describe('EMPTY Cart',()=>{
    test('Should EMPTY Cart',async()=>{
        const response = await request(app).delete('/shoppingCart/empty/'+cartOne.cart_id).expect(200)

        expect(response.body.data).not.toBeNull()
    })
})

describe('DELETE Cart',()=>{
    test('Should NOT DELETE Cart',async()=>{
        const response = await request(app).delete('/shoppingCart/delete/'+cartOne.cart_id).expect(200)

        expect(response.body.data).not.toBeNull()
    })
})