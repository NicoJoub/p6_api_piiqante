const express = require('express');

const sauceCtrl = require('../controllers/sauce');

const router = express.Router();

//permet de vérifier que l'utilisateur est bien connecté 
// l'ordre est important, si on place le multer avant le middleware d'authenfication, 
//même les images des requêtes non authentifiées seront enregistrées dans le serveur. 

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route get pour renvoyer les sauces présentes dans la base de donnée 
router.get('/', auth, sauceCtrl.getAllSauces);

//routeur pour recuperer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

// route post pour envoyer une nouvelle sauve
router.post('/', auth, multer, sauceCtrl.createSauce);

module.exports = router; 