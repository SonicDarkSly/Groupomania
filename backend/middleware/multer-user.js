// import de MULTER
const multer = require('multer');

// création d'un objet pour définire le format des images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// configuration de MULTER pour la modification du fichier image, puis la destination
const storage = multer.diskStorage({

    // destination dans le dossier /images
    destination: (req, file, callback) => {
        callback(null, `images/avatars/${req.body.userId}`)
    },

    // nouveau nom du fichier
    filename: (req, file, callback) => {
        // remplacement des points et espaces par des underscores
        const name = file.originalname.split('.')[0].split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];

        // assemblage du nouveau nom avec l'extention (nom formaté + date pour eviter l'écrasement)
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
})

// exportation de MULTER pour avatar user
module.exports = multer({ storage }).single('avatar');