const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = "./users.json";

app.use(cors());
app.use(express.json());

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const match = users.find(u => u.username === username && u.password === password);
  res.json({ success: !!match });
});

app.post("/add-user", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false });

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ success: false, message: "Benutzer existiert bereits" });
  }

  users.push({ username, password });
  writeUsers(users);
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("API läuft!");
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));