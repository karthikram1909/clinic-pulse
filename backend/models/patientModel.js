// // models/patientModel.js
// const pool = require("../config/db");

// // Generate next token number for today
// async function getNextToken() {
//   const today = new Date().toISOString().slice(0, 10);

//   const client = await pool.connect();
//   await client.query("BEGIN");

//   try {
//     const result = await client.query(
//       "SELECT last_token FROM token_counters WHERE day=$1 FOR UPDATE",
//       [today]
//     );

//     let nextToken;

//     if (result.rowCount === 0) {
//       nextToken = 1;
//       await client.query(
//         "INSERT INTO token_counters (day, last_token) VALUES ($1, $2)",
//         [today, nextToken]
//       );
//     } else {
//       nextToken = result.rows[0].last_token + 1;
//       await client.query(
//         "UPDATE token_counters SET last_token=$1 WHERE day=$2",
//         [nextToken, today]
//       );
//     }

//     await client.query("COMMIT");
//     return nextToken;
//   } catch (err) {
//     await client.query("ROLLBACK");
//     throw err;
//   } finally {
//     client.release();
//   }
// }

// module.exports = {
//   async createPatient({ name, age, purpose, notes }) {
//     const token = await getNextToken();

//     const result = await pool.query(
//       `INSERT INTO patients (token_number, name, age, purpose, notes, current_status)
//        VALUES ($1,$2,$3,$4,$5,'Waiting')
//        RETURNING *`,
//       [token, name, age || null, purpose || null, notes || null]
//     );

//     return result.rows[0];
//   },

//   async getQueue(status) {
//     let query = "SELECT * FROM patients";
//     const params = [];

//     if (status) {
//       query += " WHERE current_status=$1";
//       params.push(status);
//     }

//     query += " ORDER BY created_at ASC";

//     const result = await pool.query(query, params);
//     return result.rows;
//   },

//   async getWaiting() {
//     const result = await pool.query(
//       `SELECT *
//        FROM patients
//        WHERE current_status='Waiting'
//        ORDER BY created_at ASC`
//     );
//     return result.rows;
//   },

//   async updateStatus(id, status) {
//     const result = await pool.query(
//       `UPDATE patients SET current_status=$1 WHERE id=$2 RETURNING *`,
//       [status, id]
//     );
//     return result.rows[0];
//   },

//   async getDashboardCounts() {
//     const result = await pool.query(
//       `SELECT current_status, COUNT(*) AS count
//        FROM patients
//        WHERE created_at::date = NOW()::date
//        GROUP BY current_status`
//     );

//     const counts = { Waiting: 0, "In Consultation": 0, Completed: 0 };

//     result.rows.forEach((row) => {
//       counts[row.current_status] = Number(row.count);
//     });

//     return counts;
//   },
// };



// models/patientModel.js
const pool = require("../config/db");

// Generate next token number for today (uses DB-side Asia/Kolkata date)
async function getNextToken() {
  const client = await pool.connect();
  await client.query("BEGIN");

  try {
    // Use DB time converted to Asia/Kolkata to determine the "day"
    // token_counters.day is expected to be of type DATE
    const selectSql = `
      SELECT last_token
      FROM token_counters
      WHERE day = (now() AT TIME ZONE 'Asia/Kolkata')::date
      FOR UPDATE
    `;
    const result = await client.query(selectSql);

    let nextToken;

    if (result.rowCount === 0) {
      nextToken = 1;
      const insertSql = `
        INSERT INTO token_counters (day, last_token)
        VALUES ((now() AT TIME ZONE 'Asia/Kolkata')::date, $1)
      `;
      await client.query(insertSql, [nextToken]);
    } else {
      nextToken = result.rows[0].last_token + 1;
      const updateSql = `
        UPDATE token_counters
        SET last_token = $1
        WHERE day = (now() AT TIME ZONE 'Asia/Kolkata')::date
      `;
      await client.query(updateSql, [nextToken]);
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

// Helper SQL fragment to filter "today" in Asia/Kolkata
const TODAY_FILTER_SQL = `(created_at AT TIME ZONE 'UTC')::date = (now() AT TIME ZONE 'Asia/Kolkata')::date`;

module.exports = {
  async createPatient({ name, age, purpose, notes }) {
    const token = await getNextToken();

    const result = await pool.query(
      `INSERT INTO patients (token_number, name, age, purpose, notes, current_status)
       VALUES ($1, $2, $3, $4, $5, 'Waiting')
       RETURNING *`,
      [token, name, age || null, purpose || null, notes || null]
    );

    return result.rows[0];
  },

  // Returns only today's patients by default, optionally filter by status
  async getQueue(status) {
    let query = `SELECT * FROM patients WHERE ${TODAY_FILTER_SQL}`;
    const params = [];

    if (status) {
      query += ` AND current_status = $1`;
      params.push(status);
    }

    query += " ORDER BY created_at ASC";

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Waiting patients for today only
  async getWaiting() {
    const result = await pool.query(
      `SELECT *
       FROM patients
       WHERE current_status = 'Waiting' AND ${TODAY_FILTER_SQL}
       ORDER BY created_at ASC`
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE patients SET current_status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  // Dashboard counts for today (IST)
  async getDashboardCounts() {
    const result = await pool.query(
      `SELECT current_status, COUNT(*)::int AS count
       FROM patients
       WHERE ${TODAY_FILTER_SQL}
       GROUP BY current_status`
    );

    // initialize known statuses to zero (add more statuses if you use them)
    const counts = { Waiting: 0, "In Consultation": 0, Completed: 0 };

    result.rows.forEach((row) => {
      counts[row.current_status] = Number(row.count);
    });

    return counts;
  },

  // Optional: delete rows older than today (IST). Use with caution!
  // Returns { rowCount } from the DELETE.
  async cleanupOldPatients() {
    const result = await pool.query(
      `DELETE FROM patients
       WHERE (created_at AT TIME ZONE 'UTC')::date < (now() AT TIME ZONE 'Asia/Kolkata')::date`
    );
    return { deleted: result.rowCount };
  },
};
