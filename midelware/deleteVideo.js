
const fs = require('fs');


const deleteVideo = (imgPath) => {

    const videoPath = `videos/${imgPath}`;

    if (fs.existsSync(videoPath)) {
        fs.unlink(videoPath, (err) => {
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


module.exports = deleteVideo;