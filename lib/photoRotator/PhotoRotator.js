const fs = require('fs');
const { dialog } = require('electron');
const path = require('path');
const config = require('../../config/config.json');
const { exec } = require('child_process');
const sizeOf = require('image-size');

class PhotoRotator {
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
                });

            return PhotoRotator.base64Encode(file.filePaths[0]);
        }
    }


    async rotate(mainWindow, imagePath, degree) {
        if (!fs.existsSync(imagePath)) {
            console.log("file not exists")
            return;
        }
        if (this.currentFile !== '' && !this.isBusy) {
            this.isBusy = true;

            const imageSize = sizeOf(`${imagePath}`);
            const func = imageSize.height > imageSize.width ? 'max' : 'min';

            await exec(
                `convert ${imagePath} -distort SRT "%[fx:aa=${degree}*pi/180;\
                (w*abs(sin(aa))+h*abs(cos(aa)))/${func}(w,h)], ${degree}" ${imagePath}`, async error => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    this.base64Photo = PhotoRotator.base64Encode(`${config.uploadFolderName}/${this.currentFile}`);

                    mainWindow.webContents.send(
                        'updatePhoto',
                        {
                            'src': this.base64Photo, fileName: this.currentFile
                        });
                    this.isBusy = false;
                }
            );
        } else {
            console.log('File not chosen');
        }
    }

    static base64Encode(file) {
        const bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }
}



module.exports = {
    PhotoRotator
};
