const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "super-secret-key-change-this"; // later: move to env

app.use(cors());
app.use(express.json());

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// home
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// REGISTER
app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 4) {
    return res.status(400).json({ message: "Email and password (min 4 chars) required" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const stmt = `INSERT INTO users (email, password_hash) VALUES (?, ?)`;
  db.run(stmt, [email, passwordHash], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ message: "Email already registered" });
      }
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(201).json({ message: "User created" });
  });
});

// LOGIN
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  });
});

// --------- AUTH MIDDLEWARE ----------
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// --------- CONFIG ROUTES ----------
// Create new config
app.post("/configs", authMiddleware, (req, res) => {
  const { name, settings } = req.body;

  if (!name || !settings) {
    return res.status(400).json({ message: "name and settings are required" });
  }

  const settingsJson = JSON.stringify(settings);
  const stmt = `
    INSERT INTO configs (user_id, name, settings_json)
    VALUES (?, ?, ?)
  `;

  db.run(stmt, [req.user.userId, name, settingsJson], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving config" });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      settings,
    });
  });
});

// Get all configs for logged-in user
app.get("/configs", authMiddleware, (req, res) => {
  const query = `
    SELECT id, name, settings_json, created_at, updated_at
    FROM configs
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.all(query, [req.user.userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching configs" });
    }

    const configs = rows.map((row) => ({
      id: row.id,
      name: row.name,
      settings: JSON.parse(row.settings_json),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    res.json(configs);
  });
});

// Update a config by id (only if it belongs to user)
app.put("/configs/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, settings } = req.body;

  if (!name || !settings) {
    return res.status(400).json({ message: "name and settings are required" });
  }

  const settingsJson = JSON.stringify(settings);

  const stmt = `
    UPDATE configs
    SET name = ?, settings_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `;

  db.run(stmt, [name, settingsJson, id, req.user.userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating config" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Config not found" });
    }

    res.json({ id: Number(id), name, settings });
  });
});

// Delete a config
app.delete("/configs/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  const stmt = `
    DELETE FROM configs
    WHERE id = ? AND user_id = ?
  `;

  db.run(stmt, [id, req.user.userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting config" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Config not found" });
    }

    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
