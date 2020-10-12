const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { CustomersModel, CartWithProductsModel, CartModel } = require("../../database/mysql/sequelize");

const customerOne = {
  customer_id: 1,
  name: "myname",
  email: "myemail@gmail.com",
  password: "mypassword",
  accessToken: jwt.sign({ customer_id: 1 }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  }),
};

const cartOne = {
  cart_id: "9f906fa8-4266-4719-8808-67aef7947455",
};

const setupDB = async () => {

  // * Clearing Tables
  await CustomersModel.destroy({ where: {} });
  await CartModel.destroy({ where: {} });

  // * Creating Customer One
  await CustomersModel.create({
    customer_id: customerOne.customer_id,
    name: customerOne.name,
    email: customerOne.email,
    password: await bcrypt.hash(customerOne.password, 5),
  });

  // * Creating Cart One
  await CartModel.create({ cart_id: cartOne.cart_id });
};

module.exports = { customerOne, setupDB, cartOne };
