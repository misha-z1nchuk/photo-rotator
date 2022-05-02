const fs = require('fs');
const { dialog } = require('electron');
const path = require('path');
const im = require('imagemagick');
const config = require('../../config/config.json');

class PhotoEditor {
    constructor() {
        this.isBusy = false;
        this.currentFile = '';
        this.base64Photo = '';
    }


    async openFile() {
        const file = await dialog.showOpenDialog({
            title: 'Open image',
            filters: [ {
                name: 'Choose image',
                extensions: ['jpeg', 'png']
            }],
            properties: ['openFile']
        });

        if (!file.canceled) {
            const fileName = file.filePaths[0].split('/').pop();
            this.currentFile = fileName;

            await fs.copyFile(
                file.filePaths[0],
                path.join(config.uploadFolderName, fileName
                ), err => {
                    if (err) throw err;
                    console.log('source.txt was copied to destination.txt');
                });

            return PhotoEditor.base64Encode(file.filePaths[0]);

        }
    }



    async rotate(mainWindow, degree) {
        if (this.currentFile !== '' && !this.isBusy) {
            this.isBusy = true;
            await im.convert(
                [
                    path.join(config.uploadFolderName + '/' + this.currentFile),
                    '-rotate', degree,
                    path.join(config.uploadFolderName + '/' + this.currentFile)
                ],
                async (err, stdout) => {
                    if (err) throw err;
                    console.log('stdout:', stdout);
                    this.isBusy = false;
                    this.base64Photo = PhotoEditor.base64Encode(`${config.uploadFolderName}/${this.currentFile}`);
                    mainWindow.webContents.send(
                        'updatePhoto',
                        { 'src': this.base64Photo, fileName: this.currentFile
                        });
                });
        } else {
            console.log('File not chosen');
        }
    }

    static base64Encode(file) {
        // read binary data
        const bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }

}




module.exports = {
    PhotoEditor
};
