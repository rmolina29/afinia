var express = require('express');
const generateAccessToken = require("../middleware/auth_tk");
var router = express.Router();


/**
 * @swagger
 * /token:
 *   get:
 *     summary: Ruta para obtener token jwt
 *     description: 
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
router.get("/token", function name(req, res) {
  // En tu ruta de autenticación (por ejemplo, después de verificar las credenciales del usuario):
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API CONSULTAS AFINIA TEST' });
});

module.exports = router;
