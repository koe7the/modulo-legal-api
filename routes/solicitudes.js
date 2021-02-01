const router = require("express").Router();
const connection = require("../db_connection");

router.get("/", (request, response) => {
  const sql = "SELECT * FROM solicitudes";

  connection.query(sql, (err, res) => {
    if (err) throw err;

    response.send(res);
  });
});

router.get("/:id", (request, response) => {
  const id = request.params.id;

  let sql = `SELECT * FROM solicitudes WHERE id IN (${id})`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    response.send(res);
  });
});

router.put("/actualizacion", (request, response) => {});

module.exports = router;
