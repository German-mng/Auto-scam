const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'База клиентов',
    webPreferences: {
      nodeIntegration: false,    
      contextIsolation: true,    
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Загрузка локального сайта
  win.loadFile(path.join(__dirname, 'src', 'main.html'));

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});