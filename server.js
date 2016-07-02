var express = require('express');
var app = express();
var path = require('path');
var MongoClient = require('mongoose');

var bodyParser = require('body-parser'); // Pour récuperer les données envoyés des formulaires 
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');//pour le passport > comparer les names et passwords
// var superSecret = 'lecodesimplontop';

var config = require('./public/config')//recupere le fichier config
var User = require('./app/models/user');//recupere le model user mongoose
// var RouteApi = require('./app/routes/api');//recupere la Api Route


//Connexion à la base de données via le fichier config 
MongoClient.connect(config.database);
// app.set('secretOrKey', config.secret); //secret variable

// Nous laisse les données venant des POST
app.use(bodyParser.urlencoded({ extended: true })); //valeur à true ds celui roro
app.use(bodyParser.json());

// configuration de l'app
app.use(function(req, res, next){
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
 next();
});

app.use(morgan('dev'));//se logger à la console
app.use(passport.initialize());//Utiliser le package 'passport' dans mon application 
app.use(express.static(__dirname +'/public'));//Routes

// app.use(express.static(__dirname +'/app')); //pour les doc api et user = test
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname +'/public/app/views/index.html'));
});


// pass passport for configuration
require('./app/config/passport')(passport);
 

// API création du groupe de route de l'api
var apiRouter = express.Router();

apiRouter.get('/', function(req, res) {
	res.json({ message: 'Bienvenue sur votre API!' });
});


apiRouter.route('/user')

        // create a user (accessed at POST http://localhost:8080/api/user)
        .post(function(req, res) {
        	// create a new instance of the User model
        	var user = new User();
                        // set the user information (comes from the request)
                        user.name = req.body.name;
                        user.username = req.body.username;
                        user.password = req.body.password;
            // enregistrement dans la db avec verif des erreurs
            user.save(function(err) { if (err) {
            // duplicate entry
            if (err.code == 11000)
                return res.json({ success: false, message: 'A user with that username already exists. '});
             else
                return res.send(err);
            }
            res.json({ message: 'User created!' });
           });
    	   })

        .get(function(req, res) {
          User.find(function(err, user) {
            if (err) res.send(err);
            res.json(user);
          });
      })
        
apiRouter.route('/user/:user_id')
  	    .get(function(req, res) {
  	      User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
             res.json(user);
          });
        })
        .put(function(req, res) {
          User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
              if (req.body.name) user.name = req.body.name;
              if (req.body.username) user.username = req.body.username;
              if (req.body.password) user.password = req.body.password;
           user.save(function(err) {
        	    if (err) res.send(err);
        	    res.json({ message: 'User updated!' });
    	      });
    	     })
    	   })
        .delete(function(req, res) {
          	User.remove({
               _id: req.params.user_id
         		}, function(err, user) {
           		if (err) return res.send(err);
            		res.json({ message: 'Successfully deleted' });
        });
  });

  // GESTION DU JSON WEB TOKEN
 apiRouter.post('/authenticate', function(req, res, next){
          // find the user
          // select the name username and password explicitly 
          console.log(' post authenticate '+ req.body.username);
          User.findOne({
              username: req.body.username
          }).select('name username password').exec(function(err, user) {
                  if (err) throw err;
                      // no user with that username was found
                  if (!user) {
                      console.log("authentif failed . user not found") ;
                      res.json({ success: false, message: 'Authentication failed. User not found.'
                    });
                  } 
                else if (user) 
                {
                // check if password matches
                var validPassword = user.comparePassword(req.body.password); 
                if (!validPassword) {
                     console.log("Authentication failed. Wrong password.") ;
                      res.json({
                          success: false,
                          message: 'Authentication failed. Wrong password.'
                        });
                  } else {
                  // if user
                  // create a token
                  // var secretOrKey = 'motdepasse';
                  // var token = jwt.sign(user, app.get('secretOrKey'), {
                  //   expiresIn: 1440 // expires in 24 hours
                  // });
                  var secretOrKey = 'motdepasse';
                  var token = jwt.sign({
                        name: user.name,
                        username: user.username
                      }, secretOrKey, {
                      expiresIn : 60*60*24
                  });
                    // return the information including token as JSON
                    res.json({
                    success: true,
                    message: 'Enjoy your token!', 
                    token: token
                    }); 
                  }
            }
      });
  });

apiRouter.use(function(req, res, next) {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];

      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('secretOrKey'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided. Pas de token.' 
        });
        
      }
    });




// utiliser la route api
app.use('/api', apiRouter);


//Lancement du serveur
app.listen(8080);
console.log('ecoute de mon port');







//Registre des utilisateurs
// create a new user account (POST http://localhost:8080/signup)
// apiRouter.post('/registrer', function(req, res) {
//           if (!req.body.username || !req.body.password) {
//             res.json({success: false, msg: 'Please pass name and password.'});
//           } else {
//             var newUser = new User({
//                 name: req.body.name,
//                 // username: req.body.username,
//                 email: req.body.email,
//                 password: req.body.password

//             });
//             // enregistrer les nouvels utilisateurs
//             newUser.save(function(err) {
//               if (err) {
//                 return res.json({success: false, msg: 'Utilisateur déjà existant.'});
//               }
//               res.json({success: true, msg: "Création de l'utilisateur réussi."});
//             });
//           }
//         });

// // Route pour authentifier un utilisateur  (POST http://localhost:8080/api/authenticate)
// // get un json web token à inclure dans le header dans les futurs requetes 
// apiRouter.post('/authenticate', function(req, res) {
//           //trouver l'utilisateur
//           User.findOne({ 
//             username: req.body.username
//           }, function(err, user) {
//             if (err) throw err;
         
//             if (!user) {
//               res.send({success: false, msg: 'Authentication failed. User not found.'});
//             } else {
//               // check if password matches
//               user.comparePassword(req.body.password, function (err, isMatch) {
//                 if (isMatch && !err) {
//                   //Si l'utilisateur est trouvé et que le password est bon, créer un token
//                   var token = jwt.encode(user, config.secret,{
//                      expiresIn: 10080 //in seconds
//                   });
//                   // return the information including token as JSON
//                   //retourne les infos du token inclus dans le JSON
//                   res.json({success: true, token: 'JWT ' + token});
//                 } else {
//                   res.send({success: false, msg: 'Authentification échouée. Mauvais password.'});
//                 }
//               });
//             }
//           });
//         });

// Protect dashboard route with JWT
// apiRouter.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {
//   res.send('It worked! User id is: ' + req.user._id + '.');
// });


// Connexion à la base de données 'connectUs'
// MongoClient.connect('mongodb://localhost/connectUs', function(err, db){
//   if(err) {throw err;}
//   console.log("Connexion à la base de données connectUs");
// });
