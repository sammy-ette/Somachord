const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updatePresence: (musicData) => ipcRenderer.send('update-discord-presence', musicData),
});
