const router = require("express").Router();
const connection = require("../db_connection");

router.get("/", (request, response) => {
  ///buscar todos los contratos contado
  let sql = "SELECT * FROM contratos";

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const res2 = res.filter((contrato) => contrato.ree !== 1);

    response.send(res2);
  });
});

router.get("/:id", (request, response) => {
  const id = request.params.id;
  let sql = `SELECT * FROM contratos WHERE id=${id}`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    response.send(res);
  });
});

router.get("/contrato/:tipo/:id", (request, response) => {
  const tipo = request.params.tipo;
  const id = request.params.id;

  if (tipo === "contado") {
    let sql = `SELECT * FROM contratos_contado WHERE id_contrato=${id}`;
    connection.query(sql, (err, res) => {
      if (err) throw err;

      response.send(res);
    });
  } else {
    let sql = `SELECT * FROM contratos_credito WHERE id_contrato=${id}`;
    connection.query(sql, (err, res) => {
      if (err) throw err;

      response.send(res);
    });
  }
});

router.post("/registro", (request, response) => {
  const data = request.body;

  if (!data.id_solicitud) {
    return response.status(400).send("Error: falta de datos para el registro");
  }

  const contrato = {
    id_solicitud: data.id_solicitud,
    id_cliente: data.cliente.id,
    id_inmueble: data.inmueble.id,
    derechos_cliente: data.legal.derechos_cliente,
    obligaciones_cliente: data.legal.obligaciones_cliente,
    derechos_empresa: data.legal.derechos_empresa,
    obligaciones_empresa: data.legal.obligaciones_empresa,
    clausulas: data.legal.clausulas,
    condicion_propiedad: data.legal.condicion_propiedad,
    direccion_fiscal: data.legal.direccion_fiscal,
    fecha_consignacion: data.legal.fecha_consignacion,
    proposito: data.legal.proposito,
    tipo: data.modo_contrato.tipo,
  };

  let sql = `INSERT INTO contratos SET ?`;

  connection.query(sql, contrato, (err, res) => {
    if (err) throw err;

    /* esto es para deshabilitar la solicitud despues de registrarla */
    let sql = `Update solicitudes Set status=1 Where id=${contrato.id_solicitud}`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
    });

    /*  */
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

router.put("/actualizacion", (request, response) => {
  const data = request.body;

  const contrato = {
    id: data.id,
    id_solicitud: data.id_solicitud,
    id_cliente: data.cliente.id,
    id_inmueble: data.inmueble.id,
    derechos_cliente: data.legal.derechos_cliente,
    obligaciones_cliente: data.legal.obligaciones_cliente,
    derechos_empresa: data.legal.derechos_empresa,
    obligaciones_empresa: data.legal.obligaciones_empresa,
    clausulas: data.legal.clausulas,
    condicion_propiedad: data.legal.condicion_propiedad,
    direccion_fiscal: data.legal.direccion_fiscal,
    proposito: data.legal.proposito,
    tipo: data.modo_contrato.tipo,
  };

  /* el error es que el texto se tiene que manualmente convertir en texto */
  let sql = `Update contratos Set derechos_cliente="${contrato.derechos_cliente}", obligaciones_cliente="${contrato.obligaciones_cliente}", derechos_empresa="${contrato.derechos_empresa}", obligaciones_empresa="${contrato.obligaciones_empresa}", clausulas="${contrato.clausulas}", condicion_propiedad="${contrato.condicion_propiedad}", direccion_fiscal="${contrato.direccion_fiscal}", ree=0, proposito="${contrato.proposito}" Where id=${contrato.id} `;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    let sql = `DELETE  FROM morosidades_credito WHERE id_contrato=${contrato.id}`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
    });

    if (data.modo_contrato.tipo === "credito") {
      const contrato_credito = {
        id_credito: data.modo_contrato.id,
        cantidad_cuotas: data.modo_contrato.cantidad_cuotas,
        monto_cuotas: data.modo_contrato.monto_cuotas,
        tasa_interes: data.modo_contrato.tasa_interes,
        tipo_persona: data.modo_contrato.tipo_persona,
        razon_social: data.modo_contrato.razon_social,
        cantidad_otorgada: data.modo_contrato.cantidad_otorgada,
        plazo: data.modo_contrato.plazo,
      };

      let sql = `UPDATE contratos_credito SET cantidad_cuotas="${contrato_credito.cantidad_cuotas}", monto_cuotas="${contrato_credito.monto_cuotas}", tasa_interes="${contrato_credito.tasa_interes}", tipo_persona="${contrato_credito.tipo_persona}", razon_social="${contrato_credito.razon_social}", cantidad_otorgada="${contrato_credito.cantidad_otorgada}" WHERE id=${contrato_credito.id_credito}`;

      connection.query(sql, (err, res) => {
        if (err) throw err;

        response.send(res);
      });
    } else {
      const contrato_contado = {
        id_contado: data.modo_contrato.id,
        monto_inicial: data.modo_contrato.monto_inicial,
        modalidad_pago: data.modo_contrato.modalidad_pago,
        justificacion_pago: data.modo_contrato.justificacion_pago,
        tipo_persona: data.modo_contrato.tipo_persona,
        monto_total: data.modo_contrato.monto_total,
      };

      let sql = `UPDATE contratos_contado SET monto_inicial="${contrato_contado.monto_inicial}", modalidad_pago="${contrato_contado.modalidad_pago}
      ", justificacion_pago="${contrato_contado.justificacion_pago}", tipo_persona="${contrato_contado.tipo_persona}", monto_total="${contrato_contado.monto_total}" where id=${contrato_contado.id_contado}`;

      connection.query(sql, (err, res) => {
        if (err) throw err;

        response.send(res);
      });
    }
  });
});

router.put("/ree", (request, response) => {
  const { id, ree } = request.body;

  if (ree) {
    let sql = `Update contratos Set ree=1 Where id=${id}`;
    connection.query(sql, (err, res) => {
      if (err) throw err;

      response.send(res);
    });
  }
});

module.exports = router;
