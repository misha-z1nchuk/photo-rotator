/* eslint-disable no-unused-vars*/
require('dotenv').config();
const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const { saveAppData } = require('./photoLogic/prepare');
const { PhotoEditor } = require('./photoLogic/photo');

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const photoEditor = new PhotoEditor();

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    saveAppData();



    ipcMain.on('openFileChooser', async e => {
        try {
            const encodedImg = await photoEditor.openFile();
            mainWindow.webContents.send('showPhoto',
                { 'src': encodedImg,
                    fileName: photoEditor.currentFile,
                    filePath: `${process.env.uploadFolderName}/${photoEditor.currentFile}`
                });
        } catch (e) {
            console.log(e);
        }

    });

    ipcMain.on('rotateLeft', async e => {
        const encodedImg = await photoEditor.rotateLeft();
        if (encodedImg) {
            mainWindow.webContents.send('updatePhoto',
                { 'src': encodedImg,
                    fileName: photoEditor.currentFile
                });
        }
    });

    ipcMain.on('rotateRight', async e => {
        const encodedImg = await photoEditor.rotateRight();
        if (encodedImg) {
            mainWindow.webContents.send(
                'updatePhoto',
                { 'src': encodedImg, fileName: process.env.currentFile
                });
        }

    });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});







// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
