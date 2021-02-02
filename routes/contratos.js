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

router.post("/registro", (request, response) => {
  const data = request.body;

  if (!data.id_solicitud) {
    return response.status(400).send("Error: falta de datos para el registro");
  }

  const contrato = {
    id_solicitud: data.id_solicitud,
    id_cliente: data.cliente.id,
    derechos_cliente: data.legal.derechos_cliente,
    obligaciones_cliente: data.legal.obligaciones_cliente,
    derechos_empresa: data.legal.derechos_empresa,
    obligaciones_empresa: data.legal.obligaciones_empresa,
    clausulas: data.legal.clausulas,
    condicion_propiedad: data.legal.condicion_propiedad,
    direccion_fiscal: data.legal.direccion_fiscal,
    fecha_consignacion: data.legal.fecha_consignacion,
    proposito: data.legal.proposito,
  };

  let sql = `INSERT INTO contratos SET ?`;

  connection.query(sql, contrato, (err, res) => {
    if (err) throw err;

    if (data.modo_contrato.tipo === "credito") {
      let sql = `INSERT INTO contratos_credito SET ?`;
      const contrato_credito = {
        id_contrato: res.insertId,
        cantidad_cuotas: data.modo_contrato.cantidad_cuotas,
        monto_cuotas: data.modo_contrato.monto_cuotas,
        tasa_interes: data.modo_contrato.tasa_interes,
        tipo_persona: data.modo_contrato.tipo_persona,
        razon_social: data.modo_contrato.razon_social,
        cantidad_otorgada: data.modo_contrato.cantidad_otorgada,
        plazo: data.modo_contrato.plazo,
      };

      connection.query(sql, contrato_credito, (err, res) => {
        if (err) throw err;

        response.send(res);
      });
    } else {
      let sql = `INSERT INTO contratos_contado SET ?`;
      const contrato_contado = {
        id_contrato: res.insertId,
        monto_inicial: data.modo_contrato.monto_inicial,
        modalidad_pago: data.modo_contrato.modalidad_pago,
        justificacion_pago: data.modo_contrato.justificacion_pago,
        tipo_persona: data.modo_contrato.tipo_persona,
        monto_total: data.modo_contrato.monto_total,
      };

      connection.query(sql, contrato_contado, (err, res) => {
        if (err) throw err;

        response.send(res);
      });
    }
  });
});

router.put("/actualizacion", (request, response) => {});

module.exports = router;
