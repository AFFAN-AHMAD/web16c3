const { Router } = require("express");
const UserRouter = Router();
const fs= require("fs")
// UserRouter.get("/", (req, res) => {
//     res.send("got the data")
// })
// const app = require("../")

UserRouter.post("/create", (req, res,next) => {
    let newUser = req.body;
    // console.log(req)
    // console.log(id)
    fs.readFile("../db.json", "utf-8", (err, data) => {
        if (err) console.log(err, "error hai dost");
        const parsed = JSON.parse(data);
        parsed.users = [...parsed.users, newUser];
        fs.writeFile("../db.json", JSON.stringify(parsed), "utf-8", () => {
          res.status(201).send("user created");
        });
    });
  // next()
})

module.exports = UserRouter;