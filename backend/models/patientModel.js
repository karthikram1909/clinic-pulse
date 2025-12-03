// models/patientModel.js
const pool = require("../config/db");

// Generate next token number for today
async function getNextToken() {
  const today = new Date().toISOString().slice(0, 10);

  const client = await pool.connect();
  await client.query("BEGIN");

  try {
    const result = await client.query(
      "SELECT last_token FROM token_counters WHERE day=$1 FOR UPDATE",
      [today]
    );

    let nextToken;

    if (result.rowCount === 0) {
      nextToken = 1;
      await client.query(
        "INSERT INTO token_counters (day, last_token) VALUES ($1, $2)",
        [today, nextToken]
      );
    } else {
      nextToken = result.rows[0].last_token + 1;
      await client.query(
        "UPDATE token_counters SET last_token=$1 WHERE day=$2",
        [nextToken, today]
      );
    }

    await client.query("COMMIT");
    return nextToken;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  async createPatient({ name, age, purpose, notes }) {
    const token = await getNextToken();

    const result = await pool.query(
      `INSERT INTO patients (token_number, name, age, purpose, notes, current_status)
       VALUES ($1,$2,$3,$4,$5,'Waiting')
       RETURNING *`,
      [token, name, age || null, purpose || null, notes || null]
    );

    return result.rows[0];
  },

  async getQueue(status) {
    let query = "SELECT * FROM patients";
    const params = [];

    if (status) {
      query += " WHERE current_status=$1";
      params.push(status);
    }

    query += " ORDER BY created_at ASC";

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getWaiting() {
    const result = await pool.query(
      `SELECT *
       FROM patients
       WHERE current_status='Waiting'
       ORDER BY created_at ASC`
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE patients SET current_status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  async getDashboardCounts() {
    const result = await pool.query(
      `SELECT current_status, COUNT(*) AS count
       FROM patients
       WHERE created_at::date = NOW()::date
       GROUP BY current_status`
    );

    const counts = { Waiting: 0, "In Consultation": 0, Completed: 0 };

    result.rows.forEach((row) => {
      counts[row.current_status] = Number(row.count);
    });

    return counts;
  },
};
