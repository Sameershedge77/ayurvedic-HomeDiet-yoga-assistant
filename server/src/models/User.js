import db from "../config/db.js";

const User = {
  create: (name, email, password, role) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
        [name, email, password, role],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  },
};

export default User;
