const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle MIDI file operations
ipcMain.handle('save-midi', async (event, { midiData, fileName }) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: fileName,
      filters: [{ name: 'MIDI Files', extensions: ['mid'] }]
    });

    if (filePath) {
      await fs.writeFile(filePath, Buffer.from(midiData));
      return { success: true, filePath };
    }
    return { success: false, error: 'No file path selected' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('copy-midi-to-clipboard', async (event, { midiData, fileName }) => {
  try {
    const tempPath = path.join(app.getPath('temp'), fileName);
    await fs.writeFile(tempPath, Buffer.from(midiData));
    return { success: true, filePath: tempPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});