

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  host: "35.81.166.118",
  port: 5432,
  user: "consulta_ce_afinia",
  password: "consulta_ce_afinia*",
  database: "BI_CE_INFORMES",
});

module.exports = pool;
