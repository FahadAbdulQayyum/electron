/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import "./index.js";

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

// import clickSound from './assets/click.wav';
// const sound = new Audio(clickSound);
// document.getElementById('clickButton').addEventListener('click', () => {
//   sound.currentTime = 0;
//   sound.play().catch((error) => console.error('Error playing sound:', error));
// });

import clickSound from './assets/click.wav';
import keypressSound from './assets/keypress.wav';

// Preload audio
const sound = new Audio(clickSound);
sound.preload = 'auto';

// Preload keypress sound
const keypressSoundAudio = new Audio(keypressSound);
keypressSoundAudio.preload = 'auto';

// Play sound on any click in the document
document.addEventListener('click', () => {
  sound.currentTime = 0; // Reset to start
  sound.play().catch((error) => {
    console.error('Error playing sound:', error);
  });
});

// Play sound on any keypress
document.addEventListener('keydown', (event) => {
  // Optional: Ignore certain keys (e.g., Shift, Ctrl) if needed
  const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'];
  if (ignoredKeys.includes(event.key)) return;

  keypressSoundAudio.currentTime = 0; // Reset to start
  keypressSoundAudio.play().catch((error) => {
    console.error('Error playing keypress sound:', error);
  });
});

// import './index.css';

// console.log('👋 This message is being logged by "renderer.js", included via webpack');
