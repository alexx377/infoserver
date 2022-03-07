const settings = require('./settings.json');

const express = require('express');
const app = express();

const mod_reciever = require('./modules/reciever/reciever.js');
const mod_json = require('./modules/json/json.js');
const mod_web = require('./modules/web/web.js');
//

app.use('/r', mod_reciever);
app.use('/json', mod_json);
app.use('/', mod_web);

app.get('*', function(req, res){
  res.status(404).send('what???');
});

//
app.listen(settings.listen_port, function(err) {
  if(err) {
    console.log("Ошибка запуска сервера на порту " + settings.listen_port + "!");
    console.log(err.error);
    return;
  };

  console.log("Сервер успешно стартовал на порту " + settings.listen_port);
});
