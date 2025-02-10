import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { Buffer } from 'buffer';

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
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
      await writeFile(filePath, Buffer.from(midiData));
      return { success: true, filePath };
    }
    return { success: false, error: 'No file path selected' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('copy-midi-to-clipboard', async (event, { midiData, fileName }) => {
  try {
    const tempPath = join(app.getPath('temp'), fileName);
    await writeFile(tempPath, Buffer.from(midiData));
    return { success: true, filePath: tempPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});