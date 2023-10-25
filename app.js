require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const { errors } = require('celebrate');

const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/index');

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const corsParams = {
  origin: ['localhost:3000',
    'localhost:3001',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsParams));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(limiter);
app.use(requestLogger);

// подключаемся к серверу mongo
mongoose.connect(DB_URL);

app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
