// // //Routeur
// var express = require('express');
// var app = express();
// var apiRouter = express.Router();

// apiRouter.get('/', function(request, response) {
// 	response.json({ message: 'Bienvenue sur votre API!' });
//  });

//  apiRouter.route('/user')
//         // create a user (accessed at POST http://localhost:8080/api/user)
//         .post(function(req, res) {
//         	// create a new instance of the User model
//         	var user = new User();
//                         // set the user information (comes from the request)
//                         user.name = req.body.name;
//                         user.username = req.body.username;
//                         user.password = req.body.password;
//             // enregistrement dans la db avec verif des erreurs
//             user.save(function(err) { if (err) {
//                         // duplicate entry
//             if (err.code == 11000)
//                 return res.json({ success: false, message: 'A user with that\
//             username already exists. '});
//              else
//                 return res.send(err);
//             }
//             res.json({ message: 'User created!' });
//            });
//     	   })

//         .get(function(req, res) {
//           User.find(function(err, user) {
//             if (err) res.send(err);
//             res.json(user);
//           });
//         })
        
//         apiRouter.route('/user/:user_id')
//   	    .get(function(req, res) {
//   	      User.findById(req.params.user_id, function(err, user) {
//             if (err) res.send(err);
//              res.json(user);
//           });
//         })
//         .put(function(req, res) {
//           User.findById(req.params.user_id, function(err, user) {
//             if (err) res.send(err);
//               if (req.body.name) user.name = req.body.name;
//               if (req.body.username) user.username = req.body.username;
//               if (req.body.password) user.password = req.body.password;
//            user.save(function(err) {
//         	    if (err) res.send(err);
//         	    res.json({ message: 'User updated!' });
//     	      });
//     	     })
//     	   })
//         .delete(function(req, res) {
//           	User.remove({
//                _id: req.params.user_id
//          		}, function(err, user) {
//            		if (err) return res.send(err);
//             		res.json({ message: 'Successfully deleted' });
//         });
//   });

// // utiliser la route api
// // app.use('/api', apiRouter);

// module.exports = apiRouter;