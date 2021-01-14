const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bodyParser = require("body-parser");

/// setting the env var and the server
const server = express();
dotenv.config();
const { env } = process;

///database connection
const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
});

///middlewares
server.use(morgan("dev"));
server.use(bodyParser.json());

///starting the server
connection.connect((err) => {
  if (err) {
    console.log(`error: ${err}`);
    return;
  }
  console.log(`database ${env.DB_NAME} connected`);
  server.listen(process.env.PORT, () => {
    console.log(`server's up at the port: ${process.env.PORT}`);
  });
});

///SQL -> test routes

/* notacion acerca los los placeholders para parametros

Alternatively, you can use ? characters as placeholders for values you would like to have escaped like this:

connection.query('SELECT * FROM users WHERE id = ?', [userId], function (error, results, fields) {
  if (error) throw error;
  // ...
}); 

*/

server.get("/", (request, response) => {
  const sql = "SELECT * FROM perfil";

  connection.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      response.json(result);
    } else {
      response.send("no hay resultado");
    }
  });
});

server.get("/perfil/:id", (request, response) => {
  response.send("aqui se buysco un perfil");
});

server.post("/add", (request, response) => {
  const sql = "INSERT INTO perfil SET ?";
  const perfil = {
    nombre: request.body.nombre,
    apellido: request.body.apellido,
  };

  /* para hacer un post query se usan tres parametros: el sql, el objeto a guardar y un callback */
  connection.query(sql, perfil, (err) => {
    if (err) throw err;

    response.send("customer created!");
  });
});

server.put("/perfil/:oldNombre", (request, response) => {
  const { oldNombre } = request.params;
  const { nombre, apellido } = request.body;
  //con la instruccion update no es necesario los tres parametros, con el sql indentado con los nuevos datos ya basta
  const sql = `UPDATE perfil SET nombre = '${nombre}', apellido = '${apellido}' WHERE nombre='${oldNombre}'`;

  connection.query(sql, (err) => {
    if (err) throw err;
    response.send("customer updated");
  });
});

server.delete("/perfil/:deleteName", (request, response) => {
  const { deleteName } = request.params;
  //uso comillas con el WHERE nombre porque estoy seleccionando por medio de texto, si fuera un id no se usaria las comillas''
  const sql = `DELETE FROM perfil WHERE nombre='${deleteName}'`;

  connection.query(sql, (err) => {
    if (err) throw err;

    response.send("perfil deleted");
  });
});
