const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../config/db");

router.get("/", auth, async (req, res) => {
  try {
    const data = await db.getAlerts(req.user.id, 20);
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

module.exports = router;
