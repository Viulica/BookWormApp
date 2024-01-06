const express = require('express');
const cors = require('cors');
const data = require('./models/data');
const initDatabase = require('./config/db-init');
const dataRouter = require('./routes/dataRouter.js');
const loginRouter = require('./routes/loginRouter.js');
const inboxRouter = require('./routes/inboxRouter.js');
const registerRouter = require('./routes/registerRouter.js');
const fs = require('fs');
const v4 = require("uuid").v4
const app = express();
const path = require("path")


app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname) + "/images"));
app.use(express.raw({ type: 'image/*', limit: '10mb' }));

initDatabase();

app.use('/api', (req, res, next) => {
  console.log('Middleware za /api');
  next();
});


app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/data', dataRouter);
app.use('/api/inbox', inboxRouter);

app.post('/upload', (req, res) => {
  const contentType = req.headers['content-type'];
  // console.log("Request received: ", req)

  let fileExtension;
  if (contentType === 'image/jpeg') {
      fileExtension = 'jpg';
  } else if (contentType === 'image/png') {
      fileExtension = 'png';
  } else {
     res.status(400).send("bad request");
     return;
  }

  const imageData = req.body;

  let name = v4();

  fs.writeFile(`./images/${name}.${fileExtension}`, imageData, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error saving the image');
      }
      res.send(name);
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
