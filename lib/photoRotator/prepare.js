const path = require('path');
const fs = require('fs');
const config = require('../../config/config.json');
const commandExistsSync = require('command-exists').sync;

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

// check if system has all required commands and utilities for correct work
function checkRequirements(commands) {
    for (const command of commands) {
        if (commandExistsSync(command)) {
            // proceed
        } else {
            return false;
        }
    }

    return true;
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
    saveAppData,
    checkRequirements
};
