const mysql = require('mysql2');
const util = require('util');

// Tạo pool kết nối
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'orderparties',
  connectionLimit: 10, // Số lượng kết nối tối đa
  // debug: ['ComQueryPacket', 'RowDataPacket'],
});


// Chuyển callback-based functions sang Promise-based functions
pool.query = util.promisify(pool.query);

module.exports = pool.promise();