const path = require('path');
const fs = require('fs');
const config = require('../../config/config.json');

function getAppDataPath() {

    if (process.env.NODE_ENV === 'production') {
        switch (process.platform) {
        case 'win32': {
            return path.join(process.env.APPDATA, config.programName, config.uploadFolderName);
        }
        case 'linux': {
            return path.join(process.env.HOME, config.programName, config.uploadFolderName);
        }
        default: {
            console.log('Unsupported platform!');
            process.exit(1);
        }
        }
    }
    if (process.env.NODE_ENV === 'development') {
        return path.join(__dirname, '/../../', config.uploadFolderName);
    }

}


function saveAppData() {
    const appDatatDirPath = getAppDataPath();

    config.uploadFolderName = appDatatDirPath;

    // Create appDataDir if not exist
    if (!fs.existsSync(appDatatDirPath)) {
        fs.mkdirSync(appDatatDirPath, { recursive: true });
    }
}

module.exports = {
    saveAppData
};
