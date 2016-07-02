var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


 // Création du Schema utilisateur
var UserSchema = new Schema({
		 name: String,
		 username: { type: String, required: true, index: { unique: true }},
		 password: { type: String, required: true, select: true }
 });


 // Hashé le mot de passe avant que l'utilisateur soit enregistré
 UserSchema.pre('save', function(next) {
 var user = this;

// Hashé le mot de pass seulement si le mot de pass a changé  ou un nouvel utilisateur
    if (!user.isModified('password')) return next();
    // generer le hash
    bcrypt.hash(user.password, null, null, function(err, hash) { 
        if (err) return next(err);
            // enregistrer le hash
        user.password = hash;
        next();
    });

});

 //code de roro
// // Comparer le mot de passe donné par l'utilisateur avec la base de données 
UserSchema.methods.comparePassword = function(password) { 
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

// Create method to compare password input to password saved in database
// UserSchema.methods.comparePassword = function(pw, cb) {
//     var user = this;
//   bcrypt.compare(pw, user.password, function(err, isMatch) {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   });
// };


// retourner le model
module.exports = mongoose.model('User', UserSchema);
