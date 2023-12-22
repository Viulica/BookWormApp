const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   const token = req.headers.authorization;
   console.log(token);

   if (!token) {
      return res.status(403).json({ message: 'Token nije pružen' });
   }

   jwt.verify(token, 'tajna_lozinka', async (err, decoded) => {
      if (err) {
         return res.status(401).json({ message: 'Neuspješna autentikacija tokena' });
      }
      req.user = decoded;
      next();
   });
};

module.exports = verifyToken;