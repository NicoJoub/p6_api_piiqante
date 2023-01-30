const express = require('express');
const helmet = require("helmet");
const app = express();

// protection contre la faille xss pour évitrer la lecture d'un script malveillant pouvant récuperer les données utilisateurs 
app.use(helmet.xssFilter());

// Déclaration et importation des routes 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')

app.use(express.json());

// permet de travailler avec le chemin des fichiers et des repertoires
const path = require('path');

//Installation mongoose et le connecter à notre API 
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Gildas:DBi5gPGaKZvNLgcF@openclassrooms.tky5qh7.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    //acceder a l'api depuis n'importe qulle origine ('*')
    res.setHeader('Access-Control-Allow-Origin', '*');
    //ajouter les headers mentionnés aux requêtes envoyées vers notre API 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // envouer des requêtes avec les méthodes mentionnées 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//route generale pour la creation et l'authentification user 
app.use('/api/auth', userRoutes);

// route generale pour la creation, modification et supp. des sauces 
app.use('/api/sauces', sauceRoutes);

//Cela indique a express qu'il faut gérér la ressource image 
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;