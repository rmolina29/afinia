var express = require('express');
var router = express.Router();
const db = require("../env/config");
const authenticateToken = require("../middleware/auth");


/**
 * @swagger
 * /users/rango:
 *   get:
 *     summary: Ruta Radicados por Rango de fechas
 *     description: Consulta radicados dentro de un rango de fechas.
 *     parameters:
 *       - in: query  # Cambiamos "body" a "query"
 *         name: f_inicio
 *         required: true
 *         description: Fecha de inicio del rango
 *         schema:
 *           type: string
 *       - in: query  # Cambiamos "body" a "query"
 *         name: f_fin
 *         required: true
 *         description: Fecha de fin del rango
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */

// api para consultar radicados por fecha
router.get("/rango", authenticateToken, async function (req, res, next) {
  var fecha_inicio = req.body.f_inicio;
  var fecha_fin = req.body.f_fin;

  var sql = `WITH rango_fechas AS (
  SELECT
    '${fecha_inicio}'::DATE AS fecha_inicio,
    '${fecha_fin}'::DATE AS fecha_fin
)
SELECT
  COUNT(*) AS total_radicados,
  DATE_TRUNC('day', pq.fecha_radicacion) AS fecha,
  COUNT(*) FILTER (WHERE pq.fecha_radicacion BETWEEN fecha_inicio AND fecha_fin) AS total_day
FROM
  "BI_CE_INFORMES_AFINIA".pqrs_recibidas pq
JOIN
  rango_fechas
ON pq.fecha_radicacion BETWEEN fecha_inicio AND fecha_fin
GROUP BY
  fecha
ORDER BY
  fecha`;

  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({ error: "Error en la consulta a la base de datos" });
  }
});




/**
 * @swagger
 * /users/mercurio:
 *   post:
 *     summary: Ruta consultar estado de redicado mercurio grupal y especifico
 *     description: s.
 *     parameters:
 *       - in: query  # Cambiamos "body" a "query"
 *         name: rad
 *         required: true
 *         description: Fecha de inicio del rango
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */

// api para consultar estado de redicado mercurio grupal y especifico
router.post("/mercurio", authenticateToken, async function (req, res, next) {
  var rad = req.body.rad;

  var sql = `SELECT
case 
	when  p.rad_mercurio is null then a.rad_mercurio else  p.rad_mercurio
end as rad_mercurio, 
 CASE
        WHEN p.rad_mercurio IS NOT NULL THEN p.nombre_paso
        WHEN a.rad_mercurio IS NOT NULL THEN 'Finalizado'
        ELSE 'No encontrado'
    END AS estado_radicado
FROM
    (select pp.rad_mercurio ,pp.nombre_paso  FROM "BI_CE_INFORMES_AFINIA".pqrs_pendientes pp  WHERE pp.rad_mercurio  like '%${rad}%') AS p
FULL OUTER JOIN
    (SELECT pa.rad_mercurio  FROM "BI_CE_INFORMES_AFINIA".pqrs_atendidas pa  WHERE pa.rad_mercurio  like '%${rad}%') AS a
ON
    p.rad_mercurio = a.rad_mercurio`;

  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({ error: "Error en la consulta a la base de datos" });
  }
});


/**
 * @swagger
 * /users/nic:
 *   post:
 *     summary: Ruta consultar estado de redicado mercurio grupal y especifico
 *     description: s.
 *     parameters:
 *       - in: query  # Cambiamos "body" a "query"
 *         name: rad
 *         required: true
 *         description: Fecha de inicio del rango
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */

// api para retornar ultimas 3 radicaciones
router.post("/nic", authenticateToken, async function (req, res, next) {
  var sql = `select pr.rad_mercurio, pr.rad_open, pr.tipo_pqr, pr.medio_atencion, c.nic,pr.nombre_reclamante, pr.fecha_radicacion  
	from "BI_CE_INFORMES_AFINIA".clientes c 
	join "BI_CE_INFORMES_AFINIA".pqrs_recibidas pr on pr.nic = c.nic 
	order by pr.fecha_radicacion desc 
	limit  3`;

  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({ error: "Error en la consulta a la base de datos" });
  }
});


module.exports = router;
