const express = require('express');
const app = express();

const userRoutes = require('./routes/user');

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(express.json());

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

// app.use((req, res, next) => {
//     console.log('Requête reçue !');
//     next();
// });  

// app.use((req, res, next) => {
//     res.status(201);
//     next();
// });

// app.use((req, res, next) => {
//     res.json({ message: 'Votre requête a bien été reçue !' });
//     next();
// });

// app.use((req, res, next) => {
//     console.log('Réponse envoyée avec succès !');
// });

app.use('/api/auth', userRoutes);

module.exports = app;