const express = require('express');
const router = express.Router();
const data = require('../models/data');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

   try {
      const { username, password } = req.body;
      const user = await data.korisnik.findOne({
         where: {
            korime: username,
            lozinka: password
         }
      })

      if (user) {
         const token = jwt.sign({ userId: user.idkorisnik, username: user.korime, typeOfUser: user.tipkorisnika }, 'tajna_lozinka', { expiresIn: '1h' });
         res.status(200).send(token);
      } else {
         res.status(404).json({ error: "User not found" });
      }
   } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

module.exports = router;