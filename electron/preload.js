import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveMIDI: (midiData, fileName) => 
    ipcRenderer.invoke('save-midi', { midiData, fileName }),
  
  copyMIDIToClipboard: (midiData, fileName) =>
    ipcRenderer.invoke('copy-midi-to-clipboard', { midiData, fileName })
});