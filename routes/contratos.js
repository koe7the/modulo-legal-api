const router = require("express").Router();
const connection = require("../db_connection");

router.get("/", async (request, response) => {
  let sql = "SELECT * FROM contratos";

  ///buscar todos los contratos
  connection.query(sql, (err, res) => {
    if (err) throw err;

    response.send(res);
  });
});

router.post("/registro", (request, response) => {});

router.put("/actualizacion", (request, response) => {});

module.exports = router;
