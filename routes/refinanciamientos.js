const router = require("express").Router();
const connection = require("../db_connection");

router.get("/", (request, response) => {
  let sql = "SELECT * FROM refinanciamientos_credito";
  connection.query(sql, (err, rows) => {
    if (err) throw err;

    response.send(rows);
  });
});

module.exports = router;
