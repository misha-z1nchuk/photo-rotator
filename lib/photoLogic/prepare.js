require('dotenv').config()
const path = require('path');
const fs = require('fs');


function getAppDataPath() {

    if (process.env.NODE_ENV === 'production'){
        switch (process.platform) {
            case 'win32': {
                return path.join(process.env.APPDATA, process.env.programName, process.env.uploadFolderName);
            }
            case 'linux': {
                return path.join(process.env.HOME, process.env.programName, process.env.uploadFolderName);
            }
            default: {
                console.log('Unsupported platform!');
                process.exit(1);
            }
        }
    }
    if (process.env.NODE_ENV === 'development'){
        return path.join(__dirname, '/../../', process.env.uploadFolderName)
    }

}


function saveAppData() {
    const appDatatDirPath = getAppDataPath();

    process.env.uploadFolderName = appDatatDirPath;

    // Create appDataDir if not exist
    if (!fs.existsSync(appDatatDirPath)) {
        fs.mkdirSync(appDatatDirPath, { recursive: true});
    }
}

module.exports = {
    saveAppData
}