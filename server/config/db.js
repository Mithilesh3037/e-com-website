const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for local dev (no MySQL install needed).
// Switch to MySQL by setting USE_MYSQL=true in .env
let sequelize;

if (process.env.USE_MYSQL === 'true') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );
  console.log('🗄️  Using MySQL database');
} else {
  const dbPath = path.join(__dirname, '..', 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
  console.log('🗄️  Using SQLite database at:', dbPath);
}

module.exports = sequelize;
