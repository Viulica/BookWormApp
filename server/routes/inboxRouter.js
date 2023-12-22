const express = require('express');
const router = express.Router();
const data = require('../models/data');
const verifyToken = require('./tokenVerification');
const { Op } = require('sequelize');


router.get('/', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const message = await data.poruka.findAll({
         where: {
            idposiljatelj: userId
         }
      });

      res.status(200).json(message);
   }
   catch (error) {
      res.status(404).json({ message: 'Nema nikakvih poruka' });
   }
});

router.get('/:idReciever', verifyToken, async (req, res) => {
   const idSender = req.user.userId;
   const idReciever = req.params.idReciever;

   try {
      const messagesSender = await data.poruka.findAll({
         where: {
            [Op.or]: [
               {
                  [Op.and]: {
                     idposiljatelj: idSender,
                     idprimatelj: idReciever
                  },
               },
               {
                  [Op.and]: {
                     idposiljatelj: idReciever,
                     idprimatelj: idSender
                  }
               }
            ]
         },
         order: [['vremozn', 'ASC']]
      });

      res.status(200).json(messagesSender);

   }
   catch (error) {
      res.status(404);
   }
});

router.post('/send/:idReciever', verifyToken, async (req, res) => {
   // console.log(req.user.userId);
   try {
      const idposiljatelj = req.user.userId;
      const idprimatelj = req.params.idReciever;
      const txtporuka = req.body.text;

      const trenutnoVrijeme = new Date();
      // console.log(trenutnoVrijeme);

      const sendMessage = await data.poruka.create({
         txtporuka,
         vremozn: trenutnoVrijeme, // Koristi objekt tipa Date
         idposiljatelj,
         idprimatelj
      });

      res.status(200).json({ message: "Poruka uspješno poslana", message: sendMessage });
   }
   catch (error) {
      console.log("Greška prilikom slanja poruke: ", error);
      res.status(500).json({ message: "Internal Server Error" });
   }
});


router.delete('/delete/:idSender/:idReciever', (req, res) => {

});

module.exports = router;