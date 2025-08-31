const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('path')
const DiscordRPC = require('discord-rpc')

const rpc = new DiscordRPC.Client({transport: 'ipc'})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (app.isPackaged) {
    win.removeMenu()
  }

  win.loadFile('index.html')

  ipcMain.on('update-discord-presence', (event, musicData) => {
    rpc.setActivity({
      type: 2, // listening activity
      details: musicData.details,
      state: musicData.state,
      largeImageKey: musicData.largeImageKey,
      largeImageText: musicData.largeImageText,
      smallImageKey: musicData.smallImageKey,
      smallImageText: musicData.smallImageText,
      startTimestamp: musicData.startTimestamp,
      endTimestamp: musicData.endTimestamp,
      instance: false,
    });
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  rpc.login({ clientId: '1411720223114919936' }).catch(console.error);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
