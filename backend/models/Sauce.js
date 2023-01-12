// ON crée un schema de donné qui va contenir tous les champs souhaités 
//Ensuite on va exporter ce shame en tant que modèle Mongoose, le rendant disponible pour notre application Express 

const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true },
    dislikes: { type: Number, require: true },
    userLiked: { type: [String], require: true },
    userDisliked: { type: [String], require: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);