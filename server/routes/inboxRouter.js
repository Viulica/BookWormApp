const express = require('express');
const router = express.Router();
const data = require('../models/data');
const verifyToken = require('./tokenVerification');
const { Op } = require('sequelize');


router.get('/', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const messages = await data.poruka.findAll({
         attributes: [
            'idporuka',
            'txtporuka',
            'vremozn',
            'idposiljatelj',
            'idprimatelj',
          ],
         where: {
            idposiljatelj: userId
         },
         include: [
            {
               model: data.korisnik,
               as: 'idposiljatelj_korisnik',
               attributes: [['ime', 'imePosiljatelj'], ['prezime', 'prezimePosiljatelj']],
               foreignKey: 'idposiljatelj'
            },
            {
               model: data.korisnik,
               as: 'idprimatelj_korisnik',
               attributes: [['ime', 'imePrimatelj'], ['prezime', 'prezimePrimatelj']],
               foreignKey: 'idprimatelj'
            }
         ]
      });

      const formattedMessages = messages.map(message => {
         const formattedMessage = message.get({ plain: true });

         formattedMessage.imePosiljatelj = formattedMessage.idposiljatelj_korisnik.imePosiljatelj;
         formattedMessage.prezimePosiljatelj = formattedMessage.idposiljatelj_korisnik.prezimePosiljatelj;
         formattedMessage.imePrimatelj = formattedMessage.idprimatelj_korisnik.imePrimatelj;
         formattedMessage.prezimePrimatelj = formattedMessage.idprimatelj_korisnik.prezimePrimatelj;

         delete formattedMessage.idposiljatelj_korisnik;
         delete formattedMessage.idprimatelj_korisnik;

         return formattedMessage;
      });
      
      console.log(formattedMessages);

      res.status(200).json(formattedMessages);
   }
   catch (error) {
      res.status(404).json({ message: 'Nema nikakvih poruka' });
   }
});

router.get('/messages/:idReciever', verifyToken, async (req, res) => {
   const idSender = req.user.userId;
   const idReciever = req.params.idReciever;

   console.log(idSender + " " + idReciever);
   try {
      const messagesSender = await data.poruka.findAll({
         attributes: [
            'idporuka',
            'txtporuka',
            'vremozn',
            'idposiljatelj',
            'idprimatelj',
         ],
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
         include: [
            {
               model: data.korisnik,
               as: 'idposiljatelj_korisnik',
               attributes: [['ime', 'imePosiljatelj'], ['prezime', 'prezimePosiljatelj']],
               foreignKey: 'idposiljatelj'
            },
            {
               model: data.korisnik,
               as: 'idprimatelj_korisnik',
               attributes: [['ime', 'imePrimatelj'], ['prezime', 'prezimePrimatelj']],
               foreignKey: 'idprimatelj'
            }
         ],
         order: [['vremozn', 'ASC']]
      });

      const formattedMessages = messagesSender.map(message => {
         const formattedMessage = message.get({ plain: true });

         formattedMessage.imePosiljatelj = formattedMessage.idposiljatelj_korisnik.imePosiljatelj;
         formattedMessage.prezimePosiljatelj = formattedMessage.idposiljatelj_korisnik.prezimePosiljatelj;
         formattedMessage.imePrimatelj = formattedMessage.idprimatelj_korisnik.imePrimatelj;
         formattedMessage.prezimePrimatelj = formattedMessage.idprimatelj_korisnik.prezimePrimatelj;

         delete formattedMessage.idposiljatelj_korisnik;
         delete formattedMessage.idprimatelj_korisnik;

         return formattedMessage;
      });
      
      console.log(formattedMessages);

      res.status(200).json(formattedMessages);

   }
   catch (error) {
      res.status(404);
   }
});

router.post('/messages/send/:idReciever', verifyToken, async (req, res) => {
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