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

// route post pour envoyer une nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// route pour modifier une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//route pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//route pour like et dislike la sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router; 