// muler est un package qui va nous permettre de gerer les fichiers entrants dans les requetes HTPP 

const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};


// creéation d'un constante storage a passer a multer qui va contenir la logique nécessaire pour indiquer a multer ou enregistrer les fichiers 
const storage = multer.diskStorage({
    // fonction destionation indique a multer ou enregistrer les images 
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // la fonction file namge indique à multer d'utiliser le nom d'origine, et de remplacer les espaces par des undersocres et d'ajouter un timestrape date.now() comme nom de fichier. 
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
// nous exportons ensuite l''element multer, et lui passons notre constante storage et nous lui indiquons que nous gererons uniquement les telechargements de fichier image 
module.exports = multer({ storage: storage }).single('image');