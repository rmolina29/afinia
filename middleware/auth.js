const jwt = require("jsonwebtoken");
 require('crypto').randomBytes(64).toString('hex')

function authenticateToken(req, res, next) {
 // const token = req.header("Authorization");   ---- modo viejo ya no se usa
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado: Token no proporcionado" });
  }

  console.log(jwt.decode(token));
  try {
    const decoded = jwt.verify(token, "ISES_2023**"); // Utiliza la misma clave secreta
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);

    res.status(403).json({ message: "Acceso denegado: Token inválido" });
  }
}

module.exports = authenticateToken;
