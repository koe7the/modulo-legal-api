const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connection = require("./db_connection");
const cors = require("cors");

/// setting the env var and the server _>
const server = express();
dotenv.config();
const { env } = process;

///middlewares _>
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

///starting the server _>
connection.connect((err) => {
  if (err) throw err;

  console.log(`database ${env.DB_NAME} connected`);
  server.listen(process.env.PORT, () => {
    console.log(`server's up at the port: ${process.env.PORT}`);
  });
});

//routes _>
const solicitudes = require("./routes/solicitudes");
const contratos = require("./routes/contratos");
const clientes = require("./routes/clientes");
const inmuebles = require("./routes/inmuebles");
const embargo = require("./routes/embargos");
const refinanciamiento = require("./routes/refinanciamientos");
const morosidades = require("./routes/morosidades");

server.use("/solicitudes", solicitudes);
server.use("/contratos", contratos);
server.use("/clientes", clientes);
server.use("/inmuebles", inmuebles);
server.use("/embargos", embargo);
server.use("/refinanciamientos", refinanciamiento);
server.use("/morosidades", morosidades);
