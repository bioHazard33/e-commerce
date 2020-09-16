const express = require("express");
const customerRoutes = require("./routes/customers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/customers", customerRoutes);

app.listen(PORT, (req, res) => {
    console.log("Server is running on Port : ", PORT);
});
