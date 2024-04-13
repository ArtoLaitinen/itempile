const pool = require('../db/pool.js');

const items = {
  findItems: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        `SELECT items.*, users.id as user_id, users.name as user_name, users.email as user_email
        FROM items
        INNER JOIN users ON items.owner_id = users.id`,
      );
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = items;
