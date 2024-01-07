const express = require('express');
const router = express.Router();
const data = require('../models/data');
const verifyToken = require('./tokenVerification');
const { Op, literal, Sequelize } = require('sequelize');

router.get('/', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const conversation = await data.poruka.findAll({
         attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('idposiljatelj')), 'idposiljatelj'],
            'idprimatelj',
            [literal('idposiljatelj_korisnik.ime'), 'imePosiljatelj'],
            [literal('idposiljatelj_korisnik.prezime'), 'prezimePosiljatelj'],
            [literal('idprimatelj_korisnik.ime'), 'imePrimatelj'],
            [literal('idprimatelj_korisnik.prezime'), 'prezimePrimatelj'],
          ],
          include: [
            {
              model: data.korisnik,
              as: 'idposiljatelj_korisnik',
              attributes: [],
            },
            {
              model: data.korisnik,
              as: 'idprimatelj_korisnik',
              attributes: [],
            },
          ],
          where: {
            [Op.or]: [
              { idposiljatelj: userId },
              { idprimatelj: userId },
            ],
          },
          raw: true,
      })

      
      var filteredConversation = [];

      conversation.forEach(conv => {
         if (!filteredConversation.find(obj => obj.idposiljatelj === conv.idposiljatelj && obj.idprimatelj === conv.idprimatelj ||
                                                obj.idprimatelj === conv.idposiljatelj && obj.idposiljatelj === conv.idprimatelj)) {
            filteredConversation.push(conv);
         }
      });
      

      res.status(200).json(filteredConversation);
   }
   catch (error) {
      res.status(404).json({ message: 'Nema nikakvih poruka' });
   }
});

router.post('/findUsers', verifyToken, async (req, res) => {
   const { searchTerm } = req.body;
   try {
      const rezultati = await data.korisnik.findAll({
         attributes: [
            'idkorisnik',
            'korime',
            'ime',
            'prezime'
         ],
         where: {
            [Op.or]: [
               { korime: { [Op.iLike]: `${searchTerm}%` } },
               { ime: { [Op.iLike]: `${searchTerm}%` } },
               { prezime: { [Op.iLike]: `${searchTerm}%` } },
            ],
            korime: {
               [Op.ne]: "admin"
            }
         },
         raw: true,
      });

      if (rezultati.length > 0) {
         console.log(rezultati);
         res.status(200).json(rezultati);
      }
   } catch (error) {
      console.error('Greška prilikom pretraživanja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
            [literal('idposiljatelj_korisnik.ime'), 'imePosiljatelj'],
            [literal('idposiljatelj_korisnik.prezime'), 'prezimePosiljatelj'],
            [literal('idprimatelj_korisnik.ime'), 'imePrimatelj'],
            [literal('idprimatelj_korisnik.prezime'), 'prezimePrimatelj'],
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
               attributes: [],
               foreignKey: 'idposiljatelj'
            },
            {
               model: data.korisnik,
               as: 'idprimatelj_korisnik',
               attributes: [],
               foreignKey: 'idprimatelj'
            }
         ],
         order: [['vremozn', 'ASC']],
         raw: true,
      });

      console.log(messagesSender);

      res.status(200).json(messagesSender);

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
      const { txtporuka } = req.body;

      const trenutnoVrijeme = new Date();
      trenutnoVrijeme.setUTCHours(trenutnoVrijeme.getUTCHours() + 1);
      console.log(trenutnoVrijeme);

      const sendMessage = await data.poruka.create({
         txtporuka: txtporuka,
         vremozn: trenutnoVrijeme,
         idposiljatelj: idposiljatelj,
         idprimatelj: idprimatelj
      });

      res.status(200).json({ message: "Poruka uspješno poslana", message: sendMessage });
   }
   catch (error) {
      console.log("Greška prilikom slanja poruke: ", error);
      res.status(500).json({ message: "Internal Server Error" });
   }
});


// router.delete('/delete/:idMessage', verifyToken, async (req, res) => {

// });

module.exports = router;