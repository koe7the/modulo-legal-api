const router = require("express").Router();
const connection = require("../db_connection");

router.get("/:id", (request, response) => {
  const id = request.params.id;

  let sql = `SELECT * FROM inmuebles WHERE id IN (${id})`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    response.send(res);
  });
});

module.exports = router;
