var mime = require("mime-types");
const multer = require("multer");
const path = require("path");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + mime.extension(file.mimetype)
    );
  },
});

var file_upload = multer({ storage: storage });

module.exports = file_upload;


//Uploading multiple files
// app.post('/uploadmultiple', file_upload.array('myFiles'), (req, res, next) => {
//     console.log(req);
//   const files = req.files
//   if (!files) {
//     const error = new Error('Please choose files')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   console.log(files);
//     res.send(files)
// })


// In html file add
// <form action="/index/uploadmultiple"  enctype="multipart/form-data" method="POST">
//   Select images: <input type="file" name="myFiles" multiple>
//   <input type="submit" value="Upload your files"/>
// </form>
//  