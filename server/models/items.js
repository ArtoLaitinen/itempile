const pool = require('../db/pool.js');

const items = {
  findItems: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        `SELECT items.*, users.name as user_name, users.email as user_email
        FROM items
        INNER JOIN users ON items.owner_id = users.id`,
      );
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  findItemById: async (id) => {
    try {
      const connection = await pool.getConnection();
      const selectQuery = `SELECT items.*, users.name as user_name, users.email as user_email
      FROM items
      INNER JOIN users ON items.owner_id = users.id
      WHERE items.id=?`;

      const [results] = await connection.query(selectQuery, [id]);
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  findItemsByUserId: async (userId) => {
    try {
      const connection = await pool.getConnection();
      const selectQuery = `SELECT items.*, users.name as user_name, users.email as user_email
      FROM items
      INNER JOIN users ON items.owner_id = users.id
      WHERE items.owner_id=?`;

      const [results] = await connection.query(selectQuery, [userId]);
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  createNewItem: async (item) => {
    try {
      const insertQuery = 'INSERT INTO `items` SET ?';
      const connection = await pool.getConnection();
      const [results] = await connection.query(insertQuery, [item]);
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateItem: async (id, updatedValues) => {
    try {
      const updateQuery = 'UPDATE `items` SET ? WHERE id = ?';
      const connection = await pool.getConnection();
      const [results] = await connection.query(updateQuery, [updatedValues, id]);
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteItem: async (id) => {
    try {
      const deleteQuery = 'DELETE FROM `items` WHERE id = ?';
      const connection = await pool.getConnection();
      const [results] = await connection.query(deleteQuery, [id]);
      connection.release();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = items;
