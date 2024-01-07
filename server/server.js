const express = require('express');
const cors = require('cors');
const initDatabase = require('./config/db-init');
const dataRouter = require('./routes/dataRouter.js');
const loginRouter = require('./routes/loginRouter.js');
const inboxRouter = require('./routes/inboxRouter.js');
const registerRouter = require('./routes/registerRouter.js');
const app = express();


app.use(cors());
app.use(express.json());
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
