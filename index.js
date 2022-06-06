const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const id = uuidv4();
const token = uuidv4();
const UserRouter = require("./routes/user.route.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/user/create", (req, res) => {
  let newUser = { ...req.body, id };
  //   let id = req.body.id;

  fs.readFile("./db.json", "utf-8", (err, data) => {
    if (err) console.log(err, "error hai dost");
    const parsed = JSON.parse(data);
    parsed.users = [...parsed.users, newUser];
    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.status(201).send("user created", id);
    });
  });
});

app.post("/user/login", (req, res) => {
    let { username, password } = req.body;
    if (!username || !password)
    {
        res.status(200).send("please provide username and password")
        }
  fs.readFile("./db.json", "utf-8", (err, data) => {
    if (err) console.log(err, "error hai dost login m");
    const parsed = JSON.parse(data);
    var changed = parsed.users.filter(
      (el) => el.username == username && el.password == password
    );
      console.log(changed[0]);
      if (!changed) {
          res.status(401).send("Invalid Credentials" )
      }
    if (changed) {
      // changed = changed[0];
      let { id, name, role, age, username, password } = changed[0];
      let usersBody = {
        id,
        name,
        role,
        age,
        username,
        password,
        token,
      };
      parsed.users = [...parsed.users, usersBody];
      fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
        res.send("token generated");
      });
    }
  });
});


app.post("/user/logout", (req, res) => {
    fs.readFile("./db.json", "utf-8", (err, data) => {
        if (err) console.log(err, "error h dost logot m")
        const parsed = JSON.parse(data)
        parsed.users = parsed.users.map((el) => {
            if (el.token == req.query.apiKey) {
                let { id, name, role, username, password, age } = el
                return {
                    id, name, role, username, password, age
                }
            }
            else {
                return el
            }
        })

        fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
            if (err) { console.log(err) };

            res.status(201).send("user logged out succesfully")
        })
    })
})

app.get("/",(req,res)=>{
    res.send("its working")
})
const PORT = process.env.PORT||8080
app.listen(PORT, (req, res) => {
  console.log("server started");
})
