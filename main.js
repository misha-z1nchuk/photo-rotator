const { ipcMain } = require('electron')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { dialog } = require('electron')
const fs = require("fs");
const { exec } = require("child_process");

const env = {
    uploadFolderName : 'temp',
    currentFile      : '',
}

exec(`chmod a+x ./imagemagick/magick`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(stdout)
});

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    fs.mkdir(path.join(__dirname, env.uploadFolderName), (err) => {
        if (err) console.log(err)
    });

    ipcMain.on('openFileChooser', async (e) => {
        try{


            const file = await dialog.showOpenDialog({
                title: "Open image",
                filters: [ {
                    name : 'Choose image',
                    extensions : ['jpeg', 'png']
                }],
                properties: ['openFile']
            })

            if (!file.canceled){
                const fileName = file.filePaths[0].split('/').pop()
                env.currentFile = fileName;

                await fs.copyFile(file.filePaths[0], `temp/${fileName
                }`, (err) => {
                    if (err) throw err;
                    console.log('source.txt was copied to destination.txt');
                });

                let encodedImg = base64_encode(file.filePaths[0]);
                mainWindow.webContents.send('showPhoto', {'src': encodedImg, fileName});
            }
        }catch (e){
            console.log(e)
        }

    })

    ipcMain.on('rotateLeft', async (e) => {
        if (env.currentFile !== ''){
            exec(`./imagemagick/magick ./${env.uploadFolderName}/${env.currentFile} -rotate -0.5 ./${env.uploadFolderName}/${env.currentFile}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                let encodedImg = base64_encode(`${env.uploadFolderName}/${env.currentFile}`);
                mainWindow.webContents.send('updatePhoto', {'src': encodedImg, fileName: env.currentFile});
            });
        }else {
            console.log("File not chosen")
        }
    })

    ipcMain.on('rotateRight', async (e) => {
        if (env.currentFile !== ''){
            exec(`./imagemagick/magick ./${env.uploadFolderName}/${env.currentFile} -rotate 0.5 ./${env.uploadFolderName}/${env.currentFile}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                let encodedImg = base64_encode(`${env.uploadFolderName}/${env.currentFile}`);
                mainWindow.webContents.send('updatePhoto', {'src': encodedImg, fileName: env.currentFile});
            });
        }else {
            console.log("File not chosen")
        }
    })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})







// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.