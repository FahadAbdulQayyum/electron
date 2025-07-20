const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('getTodos'),
  addTodo: (text) => ipcRenderer.invoke('addTodo', text),
  toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
  getMembers: () => ipcRenderer.invoke('getMembers'),
  addMember: (member) => ipcRenderer.invoke('addMember', member),
  updateMember: (member) => ipcRenderer.invoke('updateMember', member),
  deleteMember: (id) => ipcRenderer.invoke('deleteMember', id),
  searchMembers: (query) => ipcRenderer.invoke('searchMembers', query),
  getTrainers: () => ipcRenderer.invoke('getTrainers'),
  addTrainer: (trainer) => ipcRenderer.invoke('addTrainer', trainer),
  updateTrainer: (trainer) => ipcRenderer.invoke('updateTrainer', trainer),
  deleteTrainer: (id) => ipcRenderer.invoke('deleteTrainer', id),
  getPackages: () => ipcRenderer.invoke('getPackages'),
  addPackage: (pkg) => ipcRenderer.invoke('addPackage', pkg),
  updatePackage: (pkg) => ipcRenderer.invoke('updatePackage', pkg),
  deletePackage: (id) => ipcRenderer.invoke('deletePackage', id),
  getAttendance: (params) => ipcRenderer.invoke('getAttendance', params),
  searchMembersForAttendance: (query) => ipcRenderer.invoke('searchMembersForAttendance', query),
});









// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   getTodos: () => ipcRenderer.invoke('getTodos'),
//   addTodo: (text) => ipcRenderer.invoke('addTodo', text),
//   toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
//   getMembers: () => ipcRenderer.invoke('getMembers'),
//   addMember: (member) => ipcRenderer.invoke('addMember', member),
//   updateMember: (member) => ipcRenderer.invoke('updateMember', member),
//   deleteMember: (id) => ipcRenderer.invoke('deleteMember', id),
//   searchMembers: (query) => ipcRenderer.invoke('searchMembers', query),
//   getTrainers: () => ipcRenderer.invoke('getTrainers'),
//   addTrainer: (trainer) => ipcRenderer.invoke('addTrainer', trainer),
//   updateTrainer: (trainer) => ipcRenderer.invoke('updateTrainer', trainer),
//   deleteTrainer: (id) => ipcRenderer.invoke('deleteTrainer', id),
//   getPackages: () => ipcRenderer.invoke('getPackages'),
//   addPackage: (pkg) => ipcRenderer.invoke('addPackage', pkg),
//   updatePackage: (pkg) => ipcRenderer.invoke('updatePackage', pkg),
//   deletePackage: (id) => ipcRenderer.invoke('deletePackage', id),
//   getAttendance: (params) => ipcRenderer.invoke('getAttendance', params),
//   searchMembersForAttendance: (query) => ipcRenderer.invoke('searchMembersForAttendance', query),
// });









// // const { contextBridge, ipcRenderer } = require('electron');

// // contextBridge.exposeInMainWorld('electronAPI', {
// //   getTodos: () => ipcRenderer.invoke('getTodos'),
// //   addTodo: (text) => ipcRenderer.invoke('addTodo', text),
// //   toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
// //   getMembers: () => ipcRenderer.invoke('getMembers'),
// //   addMember: (member) => ipcRenderer.invoke('addMember', member),
// //   updateMember: (member) => ipcRenderer.invoke('updateMember', member),
// //   deleteMember: (id) => ipcRenderer.invoke('deleteMember', id),
// //   searchMembers: (query) => ipcRenderer.invoke('searchMembers', query),
// //   getTrainers: () => ipcRenderer.invoke('getTrainers'),
// //   addTrainer: (trainer) => ipcRenderer.invoke('addTrainer', trainer),
// //   updateTrainer: (trainer) => ipcRenderer.invoke('updateTrainer', trainer),
// //   deleteTrainer: (id) => ipcRenderer.invoke('deleteTrainer', id),
// //   getPackages: () => ipcRenderer.invoke('getPackages'),
// //   addPackage: (pkg) => ipcRenderer.invoke('addPackage', pkg),
// //   updatePackage: (pkg) => ipcRenderer.invoke('updatePackage', pkg),
// //   deletePackage: (id) => ipcRenderer.invoke('deletePackage', id),
// // });









// // // const { contextBridge, ipcRenderer } = require('electron');

// // // contextBridge.exposeInMainWorld('electronAPI', {
// // //   getTodos: () => ipcRenderer.invoke('getTodos'),
// // //   addTodo: (text) => ipcRenderer.invoke('addTodo', text),
// // //   toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
// // //   getMembers: () => ipcRenderer.invoke('getMembers'),
// // //   addMember: (member) => ipcRenderer.invoke('addMember', member),
// // //   updateMember: (member) => ipcRenderer.invoke('updateMember', member),
// // //   deleteMember: (id) => ipcRenderer.invoke('deleteMember', id),
// // //   searchMembers: (query) => ipcRenderer.invoke('searchMembers', query),
// // //   getTrainers: () => ipcRenderer.invoke('getTrainers'),
// // //   addTrainer: (trainer) => ipcRenderer.invoke('addTrainer', trainer),
// // //   updateTrainer: (trainer) => ipcRenderer.invoke('updateTrainer', trainer),
// // //   deleteTrainer: (id) => ipcRenderer.invoke('deleteTrainer', id),
// // // });









// // // // const { contextBridge, ipcRenderer } = require('electron');

// // // // contextBridge.exposeInMainWorld('electronAPI', {
// // // //   getTodos: () => ipcRenderer.invoke('getTodos'),
// // // //   addTodo: (text) => ipcRenderer.invoke('addTodo', text),
// // // //   toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
// // // //   getMembers: () => ipcRenderer.invoke('getMembers'),
// // // //   addMember: (member) => ipcRenderer.invoke('addMember', member),
// // // //   updateMember: (member) => ipcRenderer.invoke('updateMember', member),
// // // //   deleteMember: (id) => ipcRenderer.invoke('deleteMember', id),
// // // //   searchMembers: (query) => ipcRenderer.invoke('searchMembers', query),
// // // // });









// // // // // const { contextBridge, ipcRenderer } = require('electron');

// // // // // contextBridge.exposeInMainWorld('electronAPI', {
// // // // //   getTodos: () => ipcRenderer.invoke('getTodos'),
// // // // //   addTodo: (text) => ipcRenderer.invoke('addTodo', text),
// // // // //   toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
// // // // //   getMembers: () => ipcRenderer.invoke('getMembers'),
// // // // //   addMember: (member) => ipcRenderer.invoke('addMember', member),
// // // // //   updateMember: (member) => ipcRenderer.invoke('updateMember', member),
// // // // //   deleteMember: (id) => ipcRenderer.invoke('deleteMember', id),
// // // // // });





// // // // // // // See the Electron documentation for details on how to use preload scripts:
// // // // // // // https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// // // // // // const { contextBridge, ipcRenderer } = require('electron');

// // // // // // contextBridge.exposeInMainWorld('electronAPI', {
// // // // // //   getTodos: () => ipcRenderer.invoke('getTodos'),
// // // // // //   addTodo: (text) => ipcRenderer.invoke('addTodo', text),
// // // // // //   toggleTodo: (id) => ipcRenderer.invoke('toggleTodo', id),
// // // // // // });