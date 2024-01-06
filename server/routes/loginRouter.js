const express = require('express');
const router = express.Router();
const data = require('../models/data');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {

   try {
      const { username, password } = req.body;
      const user = await data.korisnik.findOne({
         where: {
            korime: username,
         }
      })

      bcrypt.compare(password, user.lozinka, (err, result) => {
         if (err) {
            console.log("[ERROR] Error hashing password");
            throw new Error("Hashing error");
         } else {
            if (result) {
               const token = jwt.sign({
                  userId: user.idkorisnik,
                  username: user.korime,
                  typeOfUser: user.tipkorisnika
               },
                  'tajna_lozinka')
               // { expiresIn: '1h' }};

               res.status(200).send(token);
            } else {
               res.status(404).json({ error: "User not found" });
            }
         }
      })


   } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

module.exports = router;