require("dotenv").config();
const pool = require("./config/db");

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected!", result.rows);
  } catch (err) {
    console.error("DB error:", err);
  }
})();
