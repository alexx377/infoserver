const settings = require('../../settings.json');

const express = require('express');
const router = express.Router();

const mysql = require("mysql2");

router.use(express.json());

router.get('/ping', function(req, res) {
  const ip = req.connection.remoteAddress;
  console.log('<<< Запрос связи с сервером от', ip)
  res.send('pong');
  console.log('>>> Отправлено приветствие для', ip)
});

router.post('/check', function(req, res) {
  const location = req.body.location;
  const ip = req.connection.remoteAddress;

  console.log('<<< Запрос информации о рабочем месте', location, 'от', ip);

  const connection = mysql.createConnection({
    host: settings.database.server,
    user: settings.database.user,
    database: settings.database.database,
    password: settings.database.password
  });

  connection.connect(function(err){
    if (err) {
      console.log("Ошибка SQL:", err.message);
      res.send('not exist');
      console.log(">>> Отправлен ответ об отсутствии в БД рабочего места", location, 'для', ip);
    }
    else {
      //
      connection.execute("SELECT id, location FROM computers WHERE location='" + location + "'", function(err, results, fields) {
        if (err) {
          console.log("Ошибка SQL:", err.message);
          res.send('not exist');
          console.log(">>> Отправлен ответ об отсутствии в БД рабочего места", location, 'для', ip);
        }
        else {
          if (results.length == 0) {
            res.send('not exist');
            console.log(">>> Отправлен ответ об отсутствии в БД рабочего места", location, 'для', ip);
          }
          else {
            res.send('exist');
            console.log(">>> Отправлен ответ о наличии в БД рабочего места", location, 'для', ip);
          }
        }
      });
      //
      connection.end(function(err) {
        if (err) {
          console.log("Ошибка SQL:", err.message);
        }
      });
    }
  });
});

router.post('/send', function(req, res) {
  const location = req.body.location;
  const ip = req.connection.remoteAddress;

  console.log('<<< Получена информация о рабочем месте', location, 'от', ip);
  console.log(req.body);

  res.send('ok')
});

module.exports = router;
