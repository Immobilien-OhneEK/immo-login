const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const userFile = "users.json";
let users = [];

function loadUsers() {
  if (fs.existsSync(userFile)) {
    users = JSON.parse(fs.readFileSync(userFile, "utf8"));
  } else {
    users = [];
  }
}

function saveUsers() {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

loadUsers();

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const valid = users.find(u => u.username === username && u.password === password);
  res.json({ success: !!valid });
});

app.post("/add-user", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false });

  const exists = users.find(u => u.username === username);
  if (exists) return res.json({ success: false });

  users.push({ username, password });
  saveUsers();
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server läuft auf Port " + PORT));