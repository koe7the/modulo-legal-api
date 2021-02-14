const router = require("express").Router();
const connection = require("../db_connection");

router.get("/", (request, response) => {
  let sql = "SELECT * FROM morosidades_credito";
  connection.query(sql, (err, rows) => {
    if (err) throw err;

    response.send(rows);
  });
});

router.put("/:id", (request, response) => {
  const id = request.params.id;
  let sql = `Update morosidades_credito Set status=1 Where id_contrato="${id}"`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    response.send(res);
  });
});

module.exports = router;
