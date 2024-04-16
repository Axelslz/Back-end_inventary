const db = require('../database');

const findUserByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0] ? results[0] : null);
      }
    });
  });
};

module.exports = {
  findUserByUsername
};
