#!/bin/env node
var express = require('express');
var fs = require('fs');
const nconf = require('nconf');


var LostPandaApp = function () {

    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.PORT || 8080;

        // Set the mongodb credentials
        nconf.argv().env().file('db_cred.json');

        const db_user = nconf.get('mongoUser');
        const db_pass = nconf.get('mongoPass');
        const db_host = nconf.get('mongoHost');
        const db_port = nconf.get('mongoPort');
        self.db_dir = nconf.get('mongoDatabase');

        let db_protocol = 'mongodb://';
        if (db_port === '') {
            db_protocol = 'mongodb+srv://';
        }
        self.connection_string = db_protocol + db_user + ':' + db_pass + '@' + db_host + ':' + db_port;
        console.log(self.connection_string);

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function (key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function () {
        self.routes = {};

        // Load the Client interface
        var MongoClient = require('mongodb').MongoClient;

        self.routes['/ranking'] = function (req, res) {
            // The client db connection scope is wrapped in a callback:
            MongoClient.connect(self.connection_string, { useUnifiedTopology: true }, function (err, client) {
                if (err) throw err;
                var db = client.db(self.db_dir);

                var collection = db.collection('ranking').find().sort({ score: -1 }).toArray(function (err, docs) {
                    res.setHeader('Content-Type', 'text/html');
                    res.send(docs);
                    client.close();
                });
            });
        };

        // Post ranking
        self.routes['/post'] = function (req, res, next) {
            var newScore = req.body;

            MongoClient.connect(self.connection_string, { useUnifiedTopology: true }, function (err, client) {
                if (err) throw err;
                var db = client.db(self.db_dir);

                db.collection('ranking').insertOne(newScore, function (err, records) {
                    if (err) throw err;
                    client.close();
                });
            });
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {
        self.createRoutes();
        self.app = express();

        var bodyParser = require('body-parser');
        var compression = require('compression');

        // You need to parse before posting scores
        self.app.use(bodyParser.json())
        self.app.use(bodyParser.urlencoded({ extended: true }))
        self.app.use(compression());
        self.app.use(express.static(__dirname + '/public'));

        // Add handlers for the app (from the routes).
        for (var r in self.routes) {
            if (r === '/post') {
                self.app.post(r, self.routes[r]);
            }
            else
                self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server.
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};



/**
 *  main():  Main code.
 */
var zapp = new LostPandaApp();
zapp.initialize();
zapp.start();
