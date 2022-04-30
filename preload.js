const {contextBridge, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld(
    'image',
    {
        uploadFile: () => ipcRenderer.send('openFileChooser'),
        rotateLeft: () => ipcRenderer.send('rotateLeft'),
        rotateRight: () => ipcRenderer.send('rotateRight')
    }
)

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["showPhoto", "updatePhoto"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);