const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");
const { readFile } = require("fs/promises");

const PORT = 4040;
const ARRAY = [];
for (let i = 1; i <= 100000000; i++) {
  ARRAY.push(1);
}

const app = express();
app.use(
  morgan("dev"),
  express.urlencoded({ extended: false }),
  express.json(),
  cors()
);

app.get("/users", async (req, res) => {
  try {
    const rawUsers = await readFile(process.cwd() + "/src/users.json");
    const users = JSON.parse(rawUsers.toString());

    res.json({
      users,
    });
  } catch (err) {
    res.send(err.message);
  }
});

app.get("/sum", (req, res) => {
  const now = new Date();
  try {
    const sum = ARRAY.reduce((acc, cur) => {
      if (acc % 100 === 0) {
        console.log(acc);
      }
      return (acc += cur);
    }, 0);

    res.json({
      spent: (((new Date() - now) / 1000) | 0) + " seconds",
      sum,
    });
  } catch (err) {
    res.send(err.message);
  }
});


const server = app.listen(PORT);

server.on("listening", () => console.log(`server connect on port ${PORT}`));
server.on("error", (err) => console.error(err));
