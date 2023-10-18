
const fs = require('fs');


const deletePhoto = (imgPath) => {

    const imagePath = `uploads/${imgPath}`;

    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
            } else {
                console.log('File deleted successfully.');
            }
        });
    } else {
        console.log('The file does not exist.');
    }
};


module.exports = deletePhoto;