
// function to encode file data to base64 encoded string
const fs = require('fs');
const {dialog} = require("electron");
const path = require("path");
const im = require("imagemagick");

class PhotoEditor{
    constructor() {
        this.isBusy = false;
        this.currentFile = "";
    }


    async openFile(){
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
                path.join(process.env.uploadFolderName, fileName
                ), err => {
                    if (err) throw err;
                    console.log('source.txt was copied to destination.txt');
                });

            return PhotoEditor.base64Encode(file.filePaths[0])

        }
    }

    async rotateLeft(){
        if (this.currentFile !== '' && !this.isBusy) {
            this.isBusy = true
            await im.convert(
                [
                    path.join(process.env.uploadFolderName + '/' + this.currentFile),
                    '-rotate', '-0.5',
                    path.join(process.env.uploadFolderName + '/' + this.currentFile)
                ],
                (err, stdout) => {
                    if (err) throw err;
                    console.log('stdout:', stdout);
                    this.isBusy = false
                });
            return PhotoEditor.base64Encode(`${process.env.uploadFolderName}/${this.currentFile}`);
        } else {
            console.log('File not chosen');
        }
    }

    async rotateRight(){
        if (this.currentFile !== '' && !this.isBusy) {
            this.isBusy = true
            await im.convert(
                [
                    path.join(process.env.uploadFolderName + '/' + this.currentFile),
                    '-rotate', '0.5',
                    path.join(process.env.uploadFolderName + '/' + this.currentFile)
                ],
                (err, stdout) => {
                    if (err) throw err;
                    console.log('stdout:', stdout);
                    this.isBusy = false
                });
            return PhotoEditor.base64Encode(`${process.env.uploadFolderName}/${this.currentFile}`);
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
}
