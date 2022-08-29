const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Dashboard ITE Departement!" });
});
require("./routes/tiket.routes.js")(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
