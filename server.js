/*
{
  "author": "Rico Ruszewski",
  "name": "TicTacToe",
  "description": "Usefule game realized with websockets",
  "version" : "0.0.1",
  "node": "0.8.1",
  "dependencies": {
     "async" : "0.1.22",
     "jade" : "0.26.3",
     "express" : "2.5.10",
     "websocket": "1.0.6"
  }
}
*/
/* VERY GOOD TUTORIAL http://howtonode.org/express-mongodb */


/* Festlegen von Schnittstellen und Variablen */
/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */

/* Einbinden der Expressschnittstelle */
var express = require('express');

/* Erstellen eines Servers */
var app = express.createServer();/*(function (request, response) {

    // Every request gets the same "Hello Connect" response.
    response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});
    response.end();
});*/

/* Festlegen eines Ports, dabei ist die process.env Variable nur 
    für  Nodester notwendig. Local läuft die Anwendung auf dem Port 8000 */
var port = process.env['app_port'] || 8000;

var PetrolProvider = require('./petrolProvider').PetrolProvider;
var petrolProvider = new PetrolProvider(app);


var SocketIoServer = require('./socketIoProvider').SocketIoProvider;
var socketIoServer = new SocketIoProvider(app, petrolProvider);


/* Konfiguration des Servers */
/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */

/* Einbinden von Middleware die über Connect bereitgestellt wird */
app.configure(function() {
  /* Einbinden eines Loggers */
  app.use(express.logger());
  /* Einbinden zum Parsen eines Requestbody, unterstützte Formate:
	application/json,
	application/x-www-form-urlencoded,
	multipart/form-data
   */
  app.use(express.bodyParser());
  //app.use(express.methodOverride());
  /* Einbinden des Ordners Static, welche statische Dateien wie css enthält */
  app.use(express.static(__dirname + '/static'));
});

/* Wenn Nodeumgebung auf development */
/* set NODE_ENV=development */
app.configure('development', function() {
  /* Nutzer einen ErrorHandler zur Ausgabe von dumbs und Stacks */
  app.use(express.errorHandler({
    dumbException: true,
	  showStack: true
  }));
});

/* Wenn NodeUmgebung auf production */
app.configure('production', function() {
  /* Keine Ausgabe von Errormeldungen */
  app.use(express.errorHandler());
});


/* Alle Views befinden sich im Unterordner views */
app.set('views',__dirname + '/views');
/* Viewengine ist jade */
app.set('view engine', 'jade');
/* Festlegen eines Grundlayouts für jede Seite */
app.set('view options', {layout: true});


/* Realisiung von Routen und den zu nutzenden Port */
/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */

/* Festlegen, auf welchen Port der Server zu erreichen ist */
app.listen(port, function() {
  console.log((new Date()) + ' Server ist listening on Port ' + port);
});

/* Wenn Route / angesprochen wird */
app.get('/', function (req, res) {
  /* Rendern der View root */
  res.render('home');
});

/*
app.get('/start', function (req, res) {
  petrolProvider.insertDresden();
});
*/