const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `images/posts/${req.body.userId}`);
  },
  filename: (req, file, callback) => {
    //on crée l'extension grace au mimetypes
    const extension = MIME_TYPES[file.mimetype];
    //on crée un nom de fichier
    callback(
      null,
      req.body.userId +'_post_'+ Date.now() + '.' + extension
    );
  },
});

module.exports = multer({ storage: storage }).single('imgPost');