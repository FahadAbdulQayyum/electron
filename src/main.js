const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const Database = require('better-sqlite3');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Initialize SQLite database
const dbPath = path.join(app.getPath('userData'), 'todos.db');
console.log('Database path:', dbPath); // Debug: Log database path
const db = new Database(dbPath);

// Function to check and add missing columns
function ensureSchema() {
  try {
    // Check if photo column exists in members table
    const columns = db.prepare("PRAGMA table_info(members)").all();
    const hasPhotoColumn = columns.some(column => column.name === 'photo');

    if (!hasPhotoColumn) {
      db.exec('ALTER TABLE members ADD COLUMN photo TEXT');
      console.log('Added photo column to members table');
    }

    console.log('Schema check completed');
  } catch (error) {
    console.error('Error ensuring schema:', error);
  }
}

// Create tables
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      accountOpenDate TEXT,
      fullName TEXT NOT NULL,
      height TEXT,
      weight TEXT,
      relativeType TEXT,
      relativeName TEXT,
      gender TEXT,
      contact TEXT,
      address TEXT,
      status TEXT DEFAULT 'Active',
      dayTiming TEXT,
      time TEXT,
      photo TEXT
    );
    CREATE TABLE IF NOT EXISTS trainers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      contact TEXT,
      isPersonalTrainer INTEGER DEFAULT 0,
      isGymTrainer INTEGER DEFAULT 0,
      status TEXT
    );
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      packageName TEXT NOT NULL,
      price REAL,
      gender TEXT
    );
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memberId INTEGER,
      attendanceDate TEXT,
      attendanceTime TEXT,
      FOREIGN KEY (memberId) REFERENCES members(id)
    )
  `);
  console.log('Tables created successfully');
  ensureSchema(); // Run schema migration after table creation
} catch (error) {
  console.error('Error creating tables:', error);
}

// IPC handlers for todos
// ... (unchanged)

// IPC handlers for members
ipcMain.handle('getMembers', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM members');
    const result = stmt.all();
    console.log('Fetched members:', result);
    return result;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
});

ipcMain.handle('addMember', async (event, member) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO members (
        accountOpenDate, fullName, height, weight, relativeType, relativeName,
        gender, contact, address, status, dayTiming, time, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      member.accountOpenDate || null,
      member.fullName,
      member.height || null,
      member.weight || null,
      member.relativeType || null,
      member.relativeName || null,
      member.gender || null,
      member.contact || null,
      member.address || null,
      member.status || 'Active',
      member.dayTiming || null,
      member.time || null,
      member.photo || null
    );
    console.log('Added member with ID:', result.lastInsertRowid);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
});

ipcMain.handle('updateMember', async (event, member) => {
  try {
    const stmt = db.prepare(`
      UPDATE members SET
        accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
        relativeType = ?, relativeName = ?, gender = ?, contact = ?,
        address = ?, status = ?, dayTiming = ?, time = ?, photo = ?
      WHERE id = ?
    `);
    stmt.run(
      member.accountOpenDate || null,
      member.fullName,
      member.height || null,
      member.weight || null,
      member.relativeType || null,
      member.relativeName || null,
      member.gender || null,
      member.contact || null,
      member.address || null,
      member.status || 'Active',
      member.dayTiming || null,
      member.time || null,
      member.photo || null,
      member.id
    );
    console.log('Updated member ID:', member.id);
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
});

ipcMain.handle('deleteMember', async (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM members WHERE id = ?');
    stmt.run(id);
    console.log('Deleted member ID:', id);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
});

ipcMain.handle('searchMembers', async (event, query) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM members
      WHERE status = 'Active'
      AND (fullName LIKE ? OR contact LIKE ?)
    `);
    const result = stmt.all(`%${query}%`, `%${query}%`);
    console.log('Searched members:', result);
    return result;
  } catch (error) {
    console.error('Error searching members:', error);
    throw error;
  }
});

// IPC handlers for trainers, packages, attendance
// ... (unchanged)

// IPC handlers for trainers
ipcMain.handle('getTrainers', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM trainers');
    const result = stmt.all();
    console.log('Fetched trainers:', result);
    return result;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
});

ipcMain.handle('addTrainer', async (event, trainer) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO trainers (
        fullName, contact, isPersonalTrainer, isGymTrainer, status
      ) VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      trainer.fullName,
      trainer.contact,
      trainer.isPersonalTrainer ? 1 : 0,
      trainer.isGymTrainer ? 1 : 0,
      trainer.status
    );
    console.log('Added trainer with ID:', result.lastInsertRowid);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('Error adding trainer:', error);
    throw error;
  }
});

ipcMain.handle('updateTrainer', async (event, trainer) => {
  try {
    const stmt = db.prepare(`
      UPDATE trainers SET
        fullName = ?, contact = ?, isPersonalTrainer = ?, isGymTrainer = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(
      trainer.fullName,
      trainer.contact,
      trainer.isPersonalTrainer ? 1 : 0,
      trainer.isGymTrainer ? 1 : 0,
      trainer.status,
      trainer.id
    );
    console.log('Updated trainer ID:', trainer.id);
  } catch (error) {
    console.error('Error updating trainer:', error);
    throw error;
  }
});

ipcMain.handle('deleteTrainer', async (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM trainers WHERE id = ?');
    stmt.run(id);
    console.log('Deleted trainer ID:', id);
  } catch (error) {
    console.error('Error deleting trainer:', error);
    throw error;
  }
});

// IPC handlers for packages
ipcMain.handle('getPackages', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM packages');
    const result = stmt.all();
    console.log('Fetched packages:', result);
    return result;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
});

ipcMain.handle('addPackage', async (event, pkg) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO packages (packageName, price, gender)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(
      pkg.packageName,
      pkg.price,
      pkg.gender
    );
    console.log('Added package with ID:', result.lastInsertRowid);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('Error adding package:', error);
    throw error;
  }
});

ipcMain.handle('updatePackage', async (event, pkg) => {
  try {
    const stmt = db.prepare(`
      UPDATE packages SET
        packageName = ?, price = ?, gender = ?
      WHERE id = ?
    `);
    stmt.run(
      pkg.packageName,
      pkg.price,
      pkg.gender,
      pkg.id
    );
    console.log('Updated package ID:', pkg.id);
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
});

ipcMain.handle('deletePackage', async (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM packages WHERE id = ?');
    stmt.run(id);
    console.log('Deleted package ID:', id);
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
});

// IPC handlers for attendance
ipcMain.handle('getAttendance', async (event, { memberId, month, year }) => {
  try {
    const stmt = db.prepare(`
      SELECT a.id, a.memberId, a.attendanceDate, a.attendanceTime, m.fullName
      FROM attendance a
      JOIN members m ON a.memberId = m.id
      WHERE a.memberId = ?
      AND strftime('%m', a.attendanceDate) = ?
      AND strftime('%Y', a.attendanceDate) = ?
    `);
    const result = stmt.all(memberId, month, year);
    console.log('Fetched attendance for memberId', memberId, ':', result);
    return result;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
});

ipcMain.handle('searchMembersForAttendance', async (event, query) => {
  try {
    const stmt = db.prepare(`
      SELECT id, fullName
      FROM members
      WHERE status = 'Active'
      AND (id = ? OR fullName LIKE ?)
    `);
    const result = stmt.all(isNaN(query) ? null : query, `%${query}%`);
    console.log('Searched members for attendance:', result);
    return result;
  } catch (error) {
    console.error('Error searching members for attendance:', error);
    throw error;
  }
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});









// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('node:path');
// const Database = require('better-sqlite3');

// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// // Initialize SQLite database
// const dbPath = path.join(app.getPath('userData'), 'todos.db');
// console.log('Database path:', dbPath); // Debug: Log database path
// const db = new Database(dbPath);

// // Create tables
// try {
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS todos (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       text TEXT NOT NULL,
//       done INTEGER DEFAULT 0
//     );
//     CREATE TABLE IF NOT EXISTS members (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       accountOpenDate TEXT,
//       fullName TEXT NOT NULL,
//       height TEXT,
//       weight TEXT,
//       relativeType TEXT,
//       relativeName TEXT,
//       gender TEXT,
//       contact TEXT,
//       address TEXT,
//       status TEXT DEFAULT 'Active',
//       dayTiming TEXT,
//       time TEXT,
//       photo TEXT
//     );
//     CREATE TABLE IF NOT EXISTS trainers (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       fullName TEXT NOT NULL,
//       contact TEXT,
//       isPersonalTrainer INTEGER DEFAULT 0,
//       isGymTrainer INTEGER DEFAULT 0,
//       status TEXT
//     );
//     CREATE TABLE IF NOT EXISTS packages (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       packageName TEXT NOT NULL,
//       price REAL,
//       gender TEXT
//     );
//     CREATE TABLE IF NOT EXISTS attendance (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       memberId INTEGER,
//       attendanceDate TEXT,
//       attendanceTime TEXT,
//       FOREIGN KEY (memberId) REFERENCES members(id)
//     )
//   `);
//   console.log('Tables created successfully');
// } catch (error) {
//   console.error('Error creating tables:', error);
// }

// // IPC handlers for todos
// // ... (unchanged)

// // IPC handlers for members
// ipcMain.handle('getMembers', async () => {
//   try {
//     const stmt = db.prepare('SELECT * FROM members');
//     const result = stmt.all();
//     console.log('Fetched members:', result);
//     return result;
//   } catch (error) {
//     console.error('Error fetching members:', error);
//     throw error;
//   }
// });

// ipcMain.handle('addMember', async (event, member) => {
//   try {
//     const stmt = db.prepare(`
//       INSERT INTO members (
//         accountOpenDate, fullName, height, weight, relativeType, relativeName,
//         gender, contact, address, status, dayTiming, time, photo
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);
//     const result = stmt.run(
//       member.accountOpenDate || null,
//       member.fullName,
//       member.height || null,
//       member.weight || null,
//       member.relativeType || null,
//       member.relativeName || null,
//       member.gender || null,
//       member.contact || null,
//       member.address || null,
//       member.status || 'Active',
//       member.dayTiming || null,
//       member.time || null,
//       member.photo || null
//     );
//     console.log('Added member with ID:', result.lastInsertRowid);
//     return result.lastInsertRowid;
//   } catch (error) {
//     console.error('Error adding member:', error);
//     throw error;
//   }
// });

// ipcMain.handle('updateMember', async (event, member) => {
//   try {
//     const stmt = db.prepare(`
//       UPDATE members SET
//         accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
//         relativeType = ?, relativeName = ?, gender = ?, contact = ?,
//         address = ?, status = ?, dayTiming = ?, time = ?, photo = ?
//       WHERE id = ?
//     `);
//     stmt.run(
//       member.accountOpenDate || null,
//       member.fullName,
//       member.height || null,
//       member.weight || null,
//       member.relativeType || null,
//       member.relativeName || null,
//       member.gender || null,
//       member.contact || null,
//       member.address || null,
//       member.status || 'Active',
//       member.dayTiming || null,
//       member.time || null,
//       member.photo || null,
//       member.id
//     );
//     console.log('Updated member ID:', member.id);
//   } catch (error) {
//     console.error('Error updating member:', error);
//     throw error;
//   }
// });

// ipcMain.handle('deleteMember', async (event, id) => {
//   try {
//     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
//     stmt.run(id);
//     console.log('Deleted member ID:', id);
//   } catch (error) {
//     console.error('Error deleting member:', error);
//     throw error;
//   }
// });

// ipcMain.handle('searchMembers', async (event, query) => {
//   try {
//     const stmt = db.prepare(`
//       SELECT * FROM members
//       WHERE status = 'Active'
//       AND (fullName LIKE ? OR contact LIKE ?)
//     `);
//     const result = stmt.all(`%${query}%`, `%${query}%`);
//     console.log('Searched members:', result);
//     return result;
//   } catch (error) {
//     console.error('Error searching members:', error);
//     throw error;
//   }
// });

// // IPC handlers for trainers, packages, attendance
// // ... (unchanged)

// const createWindow = () => {
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
//       contextIsolation: true,
//       enableRemoteModule: false,
//       nodeIntegration: false,
//     },
//   });

//   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
//   mainWindow.webContents.openDevTools();
// };

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     db.close();
//     app.quit();
//   }
// });









// // const { app, BrowserWindow, ipcMain } = require('electron');
// // const path = require('node:path');
// // const Database = require('better-sqlite3');

// // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // if (require('electron-squirrel-startup')) {
// //   app.quit();
// // }

// // // Initialize SQLite database
// // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // console.log('Database path:', dbPath); // Debug: Log database path
// // const db = new Database(dbPath);

// // // Create tables
// // try {
// //   db.exec(`
// //     CREATE TABLE IF NOT EXISTS todos (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       text TEXT NOT NULL,
// //       done INTEGER DEFAULT 0
// //     );
// //     CREATE TABLE IF NOT EXISTS members (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       accountOpenDate TEXT,
// //       fullName TEXT NOT NULL,
// //       height TEXT,
// //       weight TEXT,
// //       relativeType TEXT,
// //       relativeName TEXT,
// //       gender TEXT,
// //       contact TEXT,
// //       address TEXT,
// //       status TEXT,
// //       dayTiming TEXT,
// //       time TEXT
// //     );
// //     CREATE TABLE IF NOT EXISTS trainers (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       fullName TEXT NOT NULL,
// //       contact TEXT,
// //       isPersonalTrainer INTEGER DEFAULT 0,
// //       isGymTrainer INTEGER DEFAULT 0,
// //       status TEXT
// //     );
// //     CREATE TABLE IF NOT EXISTS packages (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       packageName TEXT NOT NULL,
// //       price REAL,
// //       gender TEXT
// //     );
// //     CREATE TABLE IF NOT EXISTS attendance (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       memberId INTEGER,
// //       attendanceDate TEXT,
// //       attendanceTime TEXT,
// //       FOREIGN KEY (memberId) REFERENCES members(id)
// //     )
// //   `);
// //   console.log('Tables created successfully');
// // } catch (error) {
// //   console.error('Error creating tables:', error);
// // }

// // // IPC handlers for todos
// // ipcMain.handle('getTodos', async () => {
// //   try {
// //     const stmt = db.prepare('SELECT * FROM todos');
// //     const result = stmt.all();
// //     console.log('Fetched todos:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error fetching todos:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('addTodo', async (event, text) => {
// //   try {
// //     const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
// //     const result = stmt.run(text);
// //     console.log('Added todo with ID:', result.lastInsertRowid);
// //     return result.lastInsertRowid;
// //   } catch (error) {
// //     console.error('Error adding todo:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('toggleTodo', async (event, id) => {
// //   try {
// //     const stmt = db.prepare('UPDATE todos SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?');
// //     stmt.run(id);
// //     console.log('Toggled todo ID:', id);
// //   } catch (error) {
// //     console.error('Error toggling todo:', error);
// //     throw error;
// //   }
// // });

// // // IPC handlers for members
// // ipcMain.handle('getMembers', async () => {
// //   try {
// //     const stmt = db.prepare('SELECT * FROM members');
// //     const result = stmt.all();
// //     console.log('Fetched members:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error fetching members:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('addMember', async (event, member) => {
// //   try {
// //     const stmt = db.prepare(`
// //       INSERT INTO members (
// //         accountOpenDate, fullName, height, weight, relativeType, relativeName,
// //         gender, contact, address, status, dayTiming, time
// //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //     `);
// //     const result = stmt.run(
// //       member.accountOpenDate,
// //       member.fullName,
// //       member.height,
// //       member.weight,
// //       member.relativeType,
// //       member.relativeName,
// //       member.gender,
// //       member.contact,
// //       member.address,
// //       member.status,
// //       member.dayTiming,
// //       member.time
// //     );
// //     console.log('Added member with ID:', result.lastInsertRowid);
// //     return result.lastInsertRowid;
// //   } catch (error) {
// //     console.error('Error adding member:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('updateMember', async (event, member) => {
// //   try {
// //     const stmt = db.prepare(`
// //       UPDATE members SET
// //         accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
// //         relativeType = ?, relativeName = ?, gender = ?, contact = ?,
// //         address = ?, status = ?, dayTiming = ?, time = ?
// //       WHERE id = ?
// //     `);
// //     stmt.run(
// //       member.accountOpenDate,
// //       member.fullName,
// //       member.height,
// //       member.weight,
// //       member.relativeType,
// //       member.relativeName,
// //       member.gender,
// //       member.contact,
// //       member.address,
// //       member.status,
// //       member.dayTiming,
// //       member.time,
// //       member.id
// //     );
// //     console.log('Updated member ID:', member.id);
// //   } catch (error) {
// //     console.error('Error updating member:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('deleteMember', async (event, id) => {
// //   try {
// //     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
// //     stmt.run(id);
// //     console.log('Deleted member ID:', id);
// //   } catch (error) {
// //     console.error('Error deleting member:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('searchMembers', async (event, query) => {
// //   try {
// //     const stmt = db.prepare(`
// //       SELECT * FROM members
// //       WHERE status = 'Active'
// //       AND (fullName LIKE ? OR contact LIKE ?)
// //     `);
// //     const result = stmt.all(`%${query}%`, `%${query}%`);
// //     console.log('Searched members:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error searching members:', error);
// //     throw error;
// //   }
// // });

// // // IPC handlers for trainers
// // ipcMain.handle('getTrainers', async () => {
// //   try {
// //     const stmt = db.prepare('SELECT * FROM trainers');
// //     const result = stmt.all();
// //     console.log('Fetched trainers:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error fetching trainers:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('addTrainer', async (event, trainer) => {
// //   try {
// //     const stmt = db.prepare(`
// //       INSERT INTO trainers (
// //         fullName, contact, isPersonalTrainer, isGymTrainer, status
// //       ) VALUES (?, ?, ?, ?, ?)
// //     `);
// //     const result = stmt.run(
// //       trainer.fullName,
// //       trainer.contact,
// //       trainer.isPersonalTrainer ? 1 : 0,
// //       trainer.isGymTrainer ? 1 : 0,
// //       trainer.status
// //     );
// //     console.log('Added trainer with ID:', result.lastInsertRowid);
// //     return result.lastInsertRowid;
// //   } catch (error) {
// //     console.error('Error adding trainer:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('updateTrainer', async (event, trainer) => {
// //   try {
// //     const stmt = db.prepare(`
// //       UPDATE trainers SET
// //         fullName = ?, contact = ?, isPersonalTrainer = ?, isGymTrainer = ?, status = ?
// //       WHERE id = ?
// //     `);
// //     stmt.run(
// //       trainer.fullName,
// //       trainer.contact,
// //       trainer.isPersonalTrainer ? 1 : 0,
// //       trainer.isGymTrainer ? 1 : 0,
// //       trainer.status,
// //       trainer.id
// //     );
// //     console.log('Updated trainer ID:', trainer.id);
// //   } catch (error) {
// //     console.error('Error updating trainer:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('deleteTrainer', async (event, id) => {
// //   try {
// //     const stmt = db.prepare('DELETE FROM trainers WHERE id = ?');
// //     stmt.run(id);
// //     console.log('Deleted trainer ID:', id);
// //   } catch (error) {
// //     console.error('Error deleting trainer:', error);
// //     throw error;
// //   }
// // });

// // // IPC handlers for packages
// // ipcMain.handle('getPackages', async () => {
// //   try {
// //     const stmt = db.prepare('SELECT * FROM packages');
// //     const result = stmt.all();
// //     console.log('Fetched packages:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error fetching packages:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('addPackage', async (event, pkg) => {
// //   try {
// //     const stmt = db.prepare(`
// //       INSERT INTO packages (packageName, price, gender)
// //       VALUES (?, ?, ?)
// //     `);
// //     const result = stmt.run(
// //       pkg.packageName,
// //       pkg.price,
// //       pkg.gender
// //     );
// //     console.log('Added package with ID:', result.lastInsertRowid);
// //     return result.lastInsertRowid;
// //   } catch (error) {
// //     console.error('Error adding package:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('updatePackage', async (event, pkg) => {
// //   try {
// //     const stmt = db.prepare(`
// //       UPDATE packages SET
// //         packageName = ?, price = ?, gender = ?
// //       WHERE id = ?
// //     `);
// //     stmt.run(
// //       pkg.packageName,
// //       pkg.price,
// //       pkg.gender,
// //       pkg.id
// //     );
// //     console.log('Updated package ID:', pkg.id);
// //   } catch (error) {
// //     console.error('Error updating package:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('deletePackage', async (event, id) => {
// //   try {
// //     const stmt = db.prepare('DELETE FROM packages WHERE id = ?');
// //     stmt.run(id);
// //     console.log('Deleted package ID:', id);
// //   } catch (error) {
// //     console.error('Error deleting package:', error);
// //     throw error;
// //   }
// // });

// // // IPC handlers for attendance
// // ipcMain.handle('getAttendance', async (event, { memberId, month, year }) => {
// //   try {
// //     const stmt = db.prepare(`
// //       SELECT a.id, a.memberId, a.attendanceDate, a.attendanceTime, m.fullName
// //       FROM attendance a
// //       JOIN members m ON a.memberId = m.id
// //       WHERE a.memberId = ?
// //       AND strftime('%m', a.attendanceDate) = ?
// //       AND strftime('%Y', a.attendanceDate) = ?
// //     `);
// //     const result = stmt.all(memberId, month, year);
// //     console.log('Fetched attendance for memberId', memberId, ':', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error fetching attendance:', error);
// //     throw error;
// //   }
// // });

// // ipcMain.handle('searchMembersForAttendance', async (event, query) => {
// //   try {
// //     const stmt = db.prepare(`
// //       SELECT id, fullName
// //       FROM members
// //       WHERE status = 'Active'
// //       AND (id = ? OR fullName LIKE ?)
// //     `);
// //     const result = stmt.all(isNaN(query) ? null : query, `%${query}%`);
// //     console.log('Searched members for attendance:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('Error searching members for attendance:', error);
// //     throw error;
// //   }
// // });

// // const createWindow = () => {
// //   const mainWindow = new BrowserWindow({
// //     width: 800,
// //     height: 600,
// //     webPreferences: {
// //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// //       contextIsolation: true,
// //       enableRemoteModule: false,
// //       nodeIntegration: false,
// //     },
// //   });

// //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// //   mainWindow.webContents.openDevTools();
// // };

// // app.whenReady().then(() => {
// //   createWindow();

// //   app.on('activate', () => {
// //     if (BrowserWindow.getAllWindows().length === 0) {
// //       createWindow();
// //     }
// //   });
// // });

// // app.on('window-all-closed', () => {
// //   if (process.platform !== 'darwin') {
// //     db.close();
// //     app.quit();
// //   }
// // });









// // // const { app, BrowserWindow, ipcMain } = require('electron');
// // // const path = require('node:path');
// // // const Database = require('better-sqlite3');

// // // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // // if (require('electron-squirrel-startup')) {
// // //   app.quit();
// // // }

// // // // Initialize SQLite database
// // // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // // console.log('Database path:', dbPath); // Debug: Log database path
// // // const db = new Database(dbPath);

// // // // Create tables
// // // try {
// // //   db.exec(`
// // //     CREATE TABLE IF NOT EXISTS todos (
// // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       text TEXT NOT NULL,
// // //       done INTEGER DEFAULT 0
// // //     );
// // //     CREATE TABLE IF NOT EXISTS members (
// // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       fullName TEXT NOT NULL,
// // //       contact TEXT,
// // //       fingerprintTemplate TEXT,
// // //       gender TEXT,
// // //       status TEXT DEFAULT 'Active'
// // //     );
// // //     CREATE TABLE IF NOT EXISTS trainers (
// // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       fullName TEXT NOT NULL,
// // //       contact TEXT,
// // //       isPersonalTrainer INTEGER DEFAULT 0,
// // //       isGymTrainer INTEGER DEFAULT 0,
// // //       status TEXT
// // //     );
// // //     CREATE TABLE IF NOT EXISTS packages (
// // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       packageName TEXT NOT NULL,
// // //       price REAL,
// // //       gender TEXT
// // //     );
// // //     CREATE TABLE IF NOT EXISTS attendance (
// // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       memberId INTEGER,
// // //       attendanceDate TEXT,
// // //       attendanceTime TEXT,
// // //       FOREIGN KEY (memberId) REFERENCES members(id)
// // //     )
// // //   `);
// // //   console.log('Tables created successfully');
// // // } catch (error) {
// // //   console.error('Error creating tables:', error);
// // // }

// // // // IPC handlers for todos
// // // // ... (unchanged)

// // // // IPC handlers for members
// // // ipcMain.handle('getMembers', async () => {
// // //   try {
// // //     const stmt = db.prepare('SELECT * FROM members');
// // //     const result = stmt.all();
// // //     console.log('Fetched members:', result);
// // //     return result;
// // //   } catch (error) {
// // //     console.error('Error fetching members:', error);
// // //     throw error;
// // //   }
// // // });

// // // ipcMain.handle('addMember', async (event, member) => {
// // //   try {
// // //     const stmt = db.prepare(`
// // //       INSERT INTO members (fullName, contact, fingerprintTemplate, gender, status)
// // //       VALUES (?, ?, ?, ?, ?)
// // //     `);
// // //     const result = stmt.run(
// // //       member.fullName,
// // //       member.contact,
// // //       member.fingerprintTemplate || null,
// // //       member.gender || null,
// // //       member.status || 'Active'
// // //     );
// // //     console.log('Added member with ID:', result.lastInsertRowid);
// // //     return result.lastInsertRowid;
// // //   } catch (error) {
// // //     console.error('Error adding member:', error);
// // //     throw error;
// // //   }
// // // });

// // // ipcMain.handle('updateMember', async (event, member) => {
// // //   try {
// // //     const stmt = db.prepare(`
// // //       UPDATE members SET
// // //         fullName = ?, contact = ?, fingerprintTemplate = ?, gender = ?, status = ?
// // //       WHERE id = ?
// // //     `);
// // //     stmt.run(
// // //       member.fullName,
// // //       member.contact,
// // //       member.fingerprintTemplate || null,
// // //       member.gender || null,
// // //       member.status || 'Active',
// // //       member.id
// // //     );
// // //     console.log('Updated member ID:', member.id);
// // //   } catch (error) {
// // //     console.error('Error updating member:', error);
// // //     throw error;
// // //   }
// // // });

// // // ipcMain.handle('deleteMember', async (event, id) => {
// // //   try {
// // //     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
// // //     stmt.run(id);
// // //     console.log('Deleted member ID:', id);
// // //   } catch (error) {
// // //     console.error('Error deleting member:', error);
// // //     throw error;
// // //   }
// // // });

// // // ipcMain.handle('searchMembers', async (event, query) => {
// // //   try {
// // //     const stmt = db.prepare(`
// // //       SELECT * FROM members
// // //       WHERE status = 'Active'
// // //       AND (fullName LIKE ? OR contact LIKE ?)
// // //     `);
// // //     const result = stmt.all(`%${query}%`, `%${query}%`);
// // //     console.log('Searched members:', result);
// // //     return result;
// // //   } catch (error) {
// // //     console.error('Error searching members:', error);
// // //     throw error;
// // //   }
// // // });

// // // // IPC handlers for trainers, packages, attendance
// // // // ... (unchanged)

// // // const createWindow = () => {
// // //   const mainWindow = new BrowserWindow({
// // //     width: 800,
// // //     height: 600,
// // //     webPreferences: {
// // //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// // //       contextIsolation: true,
// // //       enableRemoteModule: false,
// // //       nodeIntegration: false,
// // //     },
// // //   });

// // //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// // //   mainWindow.webContents.openDevTools();
// // // };

// // // app.whenReady().then(() => {
// // //   createWindow();

// // //   app.on('activate', () => {
// // //     if (BrowserWindow.getAllWindows().length === 0) {
// // //       createWindow();
// // //     }
// // //   });
// // // });

// // // app.on('window-all-closed', () => {
// // //   if (process.platform !== 'darwin') {
// // //     db.close();
// // //     app.quit();
// // //   }
// // // });










// // // // // const { app, BrowserWindow, ipcMain } = require('electron');
// // // // // const path = require('node:path');
// // // // // const Database = require('better-sqlite3');

// // // // // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // // // // if (require('electron-squirrel-startup')) {
// // // // //   app.quit();
// // // // // }

// // // // // // Initialize SQLite database
// // // // // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // // // // console.log('Database path:', dbPath); // Debug: Log database path
// // // // // const db = new Database(dbPath);

// // // // // // Create tables
// // // // // try {
// // // // //   db.exec(`
// // // // //     CREATE TABLE IF NOT EXISTS todos (
// // // // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // //       text TEXT NOT NULL,
// // // // //       done INTEGER DEFAULT 0
// // // // //     );
// // // // //     CREATE TABLE IF NOT EXISTS members (
// // // // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // //       accountOpenDate TEXT,
// // // // //       fullName TEXT NOT NULL,
// // // // //       height TEXT,
// // // // //       weight TEXT,
// // // // //       relativeType TEXT,
// // // // //       relativeName TEXT,
// // // // //       gender TEXT,
// // // // //       contact TEXT,
// // // // //       address TEXT,
// // // // //       status TEXT,
// // // // //       dayTiming TEXT,
// // // // //       time TEXT
// // // // //     );
// // // // //     CREATE TABLE IF NOT EXISTS trainers (
// // // // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // //       fullName TEXT NOT NULL,
// // // // //       contact TEXT,
// // // // //       isPersonalTrainer INTEGER DEFAULT 0,
// // // // //       isGymTrainer INTEGER DEFAULT 0,
// // // // //       status TEXT
// // // // //     );
// // // // //     CREATE TABLE IF NOT EXISTS packages (
// // // // //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // //       packageName TEXT NOT NULL,
// // // // //       price REAL,
// // // // //       gender TEXT
// // // // //     )
// // // // //   `);
// // // // //   console.log('Tables created successfully');
// // // // // } catch (error) {
// // // // //   console.error('Error creating tables:', error);
// // // // // }

// // // // // // IPC handlers for todos
// // // // // ipcMain.handle('getTodos', async () => {
// // // // //   try {
// // // // //     const stmt = db.prepare('SELECT * FROM todos');
// // // // //     const result = stmt.all();
// // // // //     console.log('Fetched todos:', result);
// // // // //     return result;
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching todos:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('addTodo', async (event, text) => {
// // // // //   try {
// // // // //     const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
// // // // //     const result = stmt.run(text);
// // // // //     console.log('Added todo with ID:', result.lastInsertRowid);
// // // // //     return result.lastInsertRowid;
// // // // //   } catch (error) {
// // // // //     console.error('Error adding todo:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('toggleTodo', async (event, id) => {
// // // // //   try {
// // // // //     const stmt = db.prepare('UPDATE todos SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?');
// // // // //     stmt.run(id);
// // // // //     console.log('Toggled todo ID:', id);
// // // // //   } catch (error) {
// // // // //     console.error('Error toggling todo:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // // IPC handlers for members
// // // // // ipcMain.handle('getMembers', async () => {
// // // // //   try {
// // // // //     const stmt = db.prepare('SELECT * FROM members');
// // // // //     const result = stmt.all();
// // // // //     console.log('Fetched members:', result);
// // // // //     return result;
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching members:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('addMember', async (event, member) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       INSERT INTO members (
// // // // //         accountOpenDate, fullName, height, weight, relativeType, relativeName,
// // // // //         gender, contact, address, status, dayTiming, time
// // // // //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// // // // //     `);
// // // // //     const result = stmt.run(
// // // // //       member.accountOpenDate,
// // // // //       member.fullName,
// // // // //       member.height,
// // // // //       member.weight,
// // // // //       member.relativeType,
// // // // //       member.relativeName,
// // // // //       member.gender,
// // // // //       member.contact,
// // // // //       member.address,
// // // // //       member.status,
// // // // //       member.dayTiming,
// // // // //       member.time
// // // // //     );
// // // // //     console.log('Added member with ID:', result.lastInsertRowid);
// // // // //     return result.lastInsertRowid;
// // // // //   } catch (error) {
// // // // //     console.error('Error adding member:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('updateMember', async (event, member) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       UPDATE members SET
// // // // //         accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
// // // // //         relativeType = ?, relativeName = ?, gender = ?, contact = ?,
// // // // //         address = ?, status = ?, dayTiming = ?, time = ?
// // // // //       WHERE id = ?
// // // // //     `);
// // // // //     stmt.run(
// // // // //       member.accountOpenDate,
// // // // //       member.fullName,
// // // // //       member.height,
// // // // //       member.weight,
// // // // //       member.relativeType,
// // // // //       member.relativeName,
// // // // //       member.gender,
// // // // //       member.contact,
// // // // //       member.address,
// // // // //       member.status,
// // // // //       member.dayTiming,
// // // // //       member.time,
// // // // //       member.id
// // // // //     );
// // // // //     console.log('Updated member ID:', member.id);
// // // // //   } catch (error) {
// // // // //     console.error('Error updating member:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('deleteMember', async (event, id) => {
// // // // //   try {
// // // // //     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
// // // // //     stmt.run(id);
// // // // //     console.log('Deleted member ID:', id);
// // // // //   } catch (error) {
// // // // //     console.error('Error deleting member:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('searchMembers', async (event, query) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       SELECT * FROM members
// // // // //       WHERE status = 'Active'
// // // // //       AND (fullName LIKE ? OR contact LIKE ?)
// // // // //     `);
// // // // //     const result = stmt.all(`%${query}%`, `%${query}%`);
// // // // //     console.log('Searched members:', result);
// // // // //     return result;
// // // // //   } catch (error) {
// // // // //     console.error('Error searching members:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // // IPC handlers for trainers
// // // // // ipcMain.handle('getTrainers', async () => {
// // // // //   try {
// // // // //     const stmt = db.prepare('SELECT * FROM trainers');
// // // // //     const result = stmt.all();
// // // // //     console.log('Fetched trainers:', result);
// // // // //     return result;
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching trainers:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('addTrainer', async (event, trainer) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       INSERT INTO trainers (
// // // // //         fullName, contact, isPersonalTrainer, isGymTrainer, status
// // // // //       ) VALUES (?, ?, ?, ?, ?)
// // // // //     `);
// // // // //     const result = stmt.run(
// // // // //       trainer.fullName,
// // // // //       trainer.contact,
// // // // //       trainer.isPersonalTrainer ? 1 : 0,
// // // // //       trainer.isGymTrainer ? 1 : 0,
// // // // //       trainer.status
// // // // //     );
// // // // //     console.log('Added trainer with ID:', result.lastInsertRowid);
// // // // //     return result.lastInsertRowid;
// // // // //   } catch (error) {
// // // // //     console.error('Error adding trainer:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('updateTrainer', async (event, trainer) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       UPDATE trainers SET
// // // // //         fullName = ?, contact = ?, isPersonalTrainer = ?, isGymTrainer = ?, status = ?
// // // // //       WHERE id = ?
// // // // //     `);
// // // // //     stmt.run(
// // // // //       trainer.fullName,
// // // // //       trainer.contact,
// // // // //       trainer.isPersonalTrainer ? 1 : 0,
// // // // //       trainer.isGymTrainer ? 1 : 0,
// // // // //       trainer.status,
// // // // //       trainer.id
// // // // //     );
// // // // //     console.log('Updated trainer ID:', trainer.id);
// // // // //   } catch (error) {
// // // // //     console.error('Error updating trainer:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('deleteTrainer', async (event, id) => {
// // // // //   try {
// // // // //     const stmt = db.prepare('DELETE FROM trainers WHERE id = ?');
// // // // //     stmt.run(id);
// // // // //     console.log('Deleted trainer ID:', id);
// // // // //   } catch (error) {
// // // // //     console.error('Error deleting trainer:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // // IPC handlers for packages
// // // // // ipcMain.handle('getPackages', async () => {
// // // // //   try {
// // // // //     const stmt = db.prepare('SELECT * FROM packages');
// // // // //     const result = stmt.all();
// // // // //     console.log('Fetched packages:', result);
// // // // //     return result;
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching packages:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('addPackage', async (event, pkg) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       INSERT INTO packages (packageName, price, gender)
// // // // //       VALUES (?, ?, ?)
// // // // //     `);
// // // // //     const result = stmt.run(
// // // // //       pkg.packageName,
// // // // //       pkg.price,
// // // // //       pkg.gender
// // // // //     );
// // // // //     console.log('Added package with ID:', result.lastInsertRowid);
// // // // //     return result.lastInsertRowid;
// // // // //   } catch (error) {
// // // // //     console.error('Error adding package:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('updatePackage', async (event, pkg) => {
// // // // //   try {
// // // // //     const stmt = db.prepare(`
// // // // //       UPDATE packages SET
// // // // //         packageName = ?, price = ?, gender = ?
// // // // //       WHERE id = ?
// // // // //     `);
// // // // //     stmt.run(
// // // // //       pkg.packageName,
// // // // //       pkg.price,
// // // // //       pkg.gender,
// // // // //       pkg.id
// // // // //     );
// // // // //     console.log('Updated package ID:', pkg.id);
// // // // //   } catch (error) {
// // // // //     console.error('Error updating package:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // ipcMain.handle('deletePackage', async (event, id) => {
// // // // //   try {
// // // // //     const stmt = db.prepare('DELETE FROM packages WHERE id = ?');
// // // // //     stmt.run(id);
// // // // //     console.log('Deleted package ID:', id);
// // // // //   } catch (error) {
// // // // //     console.error('Error deleting package:', error);
// // // // //     throw error;
// // // // //   }
// // // // // });

// // // // // const createWindow = () => {
// // // // //   const mainWindow = new BrowserWindow({
// // // // //     width: 800,
// // // // //     height: 600,
// // // // //     webPreferences: {
// // // // //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// // // // //       contextIsolation: true,
// // // // //       enableRemoteModule: false,
// // // // //       nodeIntegration: false,
// // // // //     },
// // // // //   });

// // // // //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// // // // //   mainWindow.webContents.openDevTools();
// // // // // };

// // // // // app.whenReady().then(() => {
// // // // //   createWindow();

// // // // //   app.on('activate', () => {
// // // // //     if (BrowserWindow.getAllWindows().length === 0) {
// // // // //       createWindow();
// // // // //     }
// // // // //   });
// // // // // });

// // // // // app.on('window-all-closed', () => {
// // // // //   if (process.platform !== 'darwin') {
// // // // //     db.close();
// // // // //     app.quit();
// // // // //   }
// // // // // });











// // // // // // const { app, BrowserWindow, ipcMain } = require('electron');
// // // // // // const path = require('node:path');
// // // // // // const Database = require('better-sqlite3');

// // // // // // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // // // // // if (require('electron-squirrel-startup')) {
// // // // // //   app.quit();
// // // // // // }

// // // // // // // Initialize SQLite database
// // // // // // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // // // // // const db = new Database(dbPath);

// // // // // // // Create tables
// // // // // // db.exec(`
// // // // // //   CREATE TABLE IF NOT EXISTS todos (
// // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // //     text TEXT NOT NULL,
// // // // // //     done INTEGER DEFAULT 0
// // // // // //   );
// // // // // //   CREATE TABLE IF NOT EXISTS members (
// // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // //     accountOpenDate TEXT,
// // // // // //     fullName TEXT NOT NULL,
// // // // // //     height TEXT,
// // // // // //     weight TEXT,
// // // // // //     relativeType TEXT,
// // // // // //     relativeName TEXT,
// // // // // //     gender TEXT,
// // // // // //     contact TEXT,
// // // // // //     address TEXT,
// // // // // //     status TEXT,
// // // // // //     dayTiming TEXT,
// // // // // //     time TEXT
// // // // // //   );
// // // // // //   CREATE TABLE IF NOT EXISTS trainers (
// // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // //     fullName TEXT NOT NULL,
// // // // // //     contact TEXT,
// // // // // //     isPersonalTrainer INTEGER DEFAULT 0,
// // // // // //     isGymTrainer INTEGER DEFAULT 0,
// // // // // //     status TEXT
// // // // // //   )
// // // // // // `);

// // // // // // // IPC handlers for todos
// // // // // // ipcMain.handle('getTodos', async () => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('SELECT * FROM todos');
// // // // // //     return stmt.all();
// // // // // //   } catch (error) {
// // // // // //     console.error('Error fetching todos:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('addTodo', async (event, text) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
// // // // // //     const result = stmt.run(text);
// // // // // //     return result.lastInsertRowid;
// // // // // //   } catch (error) {
// // // // // //     console.error('Error adding todo:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('toggleTodo', async (event, id) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('UPDATE todos SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?');
// // // // // //     stmt.run(id);
// // // // // //   } catch (error) {
// // // // // //     console.error('Error toggling todo:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // // IPC handlers for members
// // // // // // ipcMain.handle('getMembers', async () => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('SELECT * FROM members');
// // // // // //     return stmt.all();
// // // // // //   } catch (error) {
// // // // // //     console.error('Error fetching members:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('addMember', async (event, member) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare(`
// // // // // //       INSERT INTO members (
// // // // // //         accountOpenDate, fullName, height, weight, relativeType, relativeName,
// // // // // //         gender, contact, address, status, dayTiming, time
// // // // // //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// // // // // //     `);
// // // // // //     const result = stmt.run(
// // // // // //       member.accountOpenDate,
// // // // // //       member.fullName,
// // // // // //       member.height,
// // // // // //       member.weight,
// // // // // //       member.relativeType,
// // // // // //       member.relativeName,
// // // // // //       member.gender,
// // // // // //       member.contact,
// // // // // //       member.address,
// // // // // //       member.status,
// // // // // //       member.dayTiming,
// // // // // //       member.time
// // // // // //     );
// // // // // //     return result.lastInsertRowid;
// // // // // //   } catch (error) {
// // // // // //     console.error('Error adding member:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('updateMember', async (event, member) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare(`
// // // // // //       UPDATE members SET
// // // // // //         accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
// // // // // //         relativeType = ?, relativeName = ?, gender = ?, contact = ?,
// // // // // //         address = ?, status = ?, dayTiming = ?, time = ?
// // // // // //       WHERE id = ?
// // // // // //     `);
// // // // // //     stmt.run(
// // // // // //       member.accountOpenDate,
// // // // // //       member.fullName,
// // // // // //       member.height,
// // // // // //       member.weight,
// // // // // //       member.relativeType,
// // // // // //       member.relativeName,
// // // // // //       member.gender,
// // // // // //       member.contact,
// // // // // //       member.address,
// // // // // //       member.status,
// // // // // //       member.dayTiming,
// // // // // //       member.time,
// // // // // //       member.id
// // // // // //     );
// // // // // //   } catch (error) {
// // // // // //     console.error('Error updating member:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('deleteMember', async (event, id) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
// // // // // //     stmt.run(id);
// // // // // //   } catch (error) {
// // // // // //     console.error('Error deleting member:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('searchMembers', async (event, query) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare(`
// // // // // //       SELECT * FROM members
// // // // // //       WHERE status = 'Active'
// // // // // //       AND (fullName LIKE ? OR contact LIKE ?)
// // // // // //     `);
// // // // // //     return stmt.all(`%${query}%`, `%${query}%`);
// // // // // //   } catch (error) {
// // // // // //     console.error('Error searching members:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // // IPC handlers for trainers
// // // // // // ipcMain.handle('getTrainers', async () => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('SELECT * FROM trainers');
// // // // // //     return stmt.all();
// // // // // //   } catch (error) {
// // // // // //     console.error('Error fetching trainers:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('addTrainer', async (event, trainer) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare(`
// // // // // //       INSERT INTO trainers (
// // // // // //         fullName, contact, isPersonalTrainer, isGymTrainer, status
// // // // // //       ) VALUES (?, ?, ?, ?, ?)
// // // // // //     `);
// // // // // //     const result = stmt.run(
// // // // // //       trainer.fullName,
// // // // // //       trainer.contact,
// // // // // //       trainer.isPersonalTrainer ? 1 : 0,
// // // // // //       trainer.isGymTrainer ? 1 : 0,
// // // // // //       trainer.status
// // // // // //     );
// // // // // //     return result.lastInsertRowid;
// // // // // //   } catch (error) {
// // // // // //     console.error('Error adding trainer:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('updateTrainer', async (event, trainer) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare(`
// // // // // //       UPDATE trainers SET
// // // // // //         fullName = ?, contact = ?, isPersonalTrainer = ?, isGymTrainer = ?, status = ?
// // // // // //       WHERE id = ?
// // // // // //     `);
// // // // // //     stmt.run(
// // // // // //       trainer.fullName,
// // // // // //       trainer.contact,
// // // // // //       trainer.isPersonalTrainer ? 1 : 0,
// // // // // //       trainer.isGymTrainer ? 1 : 0,
// // // // // //       trainer.status,
// // // // // //       trainer.id
// // // // // //     );
// // // // // //   } catch (error) {
// // // // // //     console.error('Error updating trainer:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // ipcMain.handle('deleteTrainer', async (event, id) => {
// // // // // //   try {
// // // // // //     const stmt = db.prepare('DELETE FROM trainers WHERE id = ?');
// // // // // //     stmt.run(id);
// // // // // //   } catch (error) {
// // // // // //     console.error('Error deleting trainer:', error);
// // // // // //     throw error;
// // // // // //   }
// // // // // // });

// // // // // // const createWindow = () => {
// // // // // //   const mainWindow = new BrowserWindow({
// // // // // //     width: 800,
// // // // // //     height: 600,
// // // // // //     webPreferences: {
// // // // // //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// // // // // //       contextIsolation: true,
// // // // // //       enableRemoteModule: false,
// // // // // //       nodeIntegration: false,
// // // // // //     },
// // // // // //   });

// // // // // //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// // // // // //   mainWindow.webContents.openDevTools();
// // // // // // };

// // // // // // app.whenReady().then(() => {
// // // // // //   createWindow();

// // // // // //   app.on('activate', () => {
// // // // // //     if (BrowserWindow.getAllWindows().length === 0) {
// // // // // //       createWindow();
// // // // // //     }
// // // // // //   });
// // // // // // });

// // // // // // app.on('window-all-closed', () => {
// // // // // //   if (process.platform !== 'darwin') {
// // // // // //     db.close();
// // // // // //     app.quit();
// // // // // //   }
// // // // // // });









// // // // // // // const { app, BrowserWindow, ipcMain } = require('electron');
// // // // // // // const path = require('node:path');
// // // // // // // const Database = require('better-sqlite3');

// // // // // // // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // // // // // // if (require('electron-squirrel-startup')) {
// // // // // // //   app.quit();
// // // // // // // }

// // // // // // // // Initialize SQLite database
// // // // // // // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // // // // // // const db = new Database(dbPath);

// // // // // // // // Create tables
// // // // // // // db.exec(`
// // // // // // //   CREATE TABLE IF NOT EXISTS todos (
// // // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // // //     text TEXT NOT NULL,
// // // // // // //     done INTEGER DEFAULT 0
// // // // // // //   );
// // // // // // //   CREATE TABLE IF NOT EXISTS members (
// // // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // // //     accountOpenDate TEXT,
// // // // // // //     fullName TEXT NOT NULL,
// // // // // // //     height TEXT,
// // // // // // //     weight TEXT,
// // // // // // //     relativeType TEXT,
// // // // // // //     relativeName TEXT,
// // // // // // //     gender TEXT,
// // // // // // //     contact TEXT,
// // // // // // //     address TEXT,
// // // // // // //     status TEXT,
// // // // // // //     dayTiming TEXT,
// // // // // // //     time TEXT
// // // // // // //   )
// // // // // // // `);

// // // // // // // // IPC handlers for todos
// // // // // // // ipcMain.handle('getTodos', async () => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare('SELECT * FROM todos');
// // // // // // //     return stmt.all();
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error fetching todos:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // ipcMain.handle('addTodo', async (event, text) => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
// // // // // // //     const result = stmt.run(text);
// // // // // // //     return result.lastInsertRowid;
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error adding todo:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // ipcMain.handle('toggleTodo', async (event, id) => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare('UPDATE todos SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?');
// // // // // // //     stmt.run(id);
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error toggling todo:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // // IPC handlers for members
// // // // // // // ipcMain.handle('getMembers', async () => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare('SELECT * FROM members');
// // // // // // //     return stmt.all();
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error fetching members:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // ipcMain.handle('addMember', async (event, member) => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare(`
// // // // // // //       INSERT INTO members (
// // // // // // //         accountOpenDate, fullName, height, weight, relativeType, relativeName,
// // // // // // //         gender, contact, address, status, dayTiming, time
// // // // // // //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// // // // // // //     `);
// // // // // // //     const result = stmt.run(
// // // // // // //       member.accountOpenDate,
// // // // // // //       member.fullName,
// // // // // // //       member.height,
// // // // // // //       member.weight,
// // // // // // //       member.relativeType,
// // // // // // //       member.relativeName,
// // // // // // //       member.gender,
// // // // // // //       member.contact,
// // // // // // //       member.address,
// // // // // // //       member.status,
// // // // // // //       member.dayTiming,
// // // // // // //       member.time
// // // // // // //     );
// // // // // // //     return result.lastInsertRowid;
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error adding member:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // ipcMain.handle('updateMember', async (event, member) => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare(`
// // // // // // //       UPDATE members SET
// // // // // // //         accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
// // // // // // //         relativeType = ?, relativeName = ?, gender = ?, contact = ?,
// // // // // // //         address = ?, status = ?, dayTiming = ?, time = ?
// // // // // // //       WHERE id = ?
// // // // // // //     `);
// // // // // // //     stmt.run(
// // // // // // //       member.accountOpenDate,
// // // // // // //       member.fullName,
// // // // // // //       member.height,
// // // // // // //       member.weight,
// // // // // // //       member.relativeType,
// // // // // // //       member.relativeName,
// // // // // // //       member.gender,
// // // // // // //       member.contact,
// // // // // // //       member.address,
// // // // // // //       member.status,
// // // // // // //       member.dayTiming,
// // // // // // //       member.time,
// // // // // // //       member.id
// // // // // // //     );
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error updating member:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // ipcMain.handle('deleteMember', async (event, id) => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
// // // // // // //     stmt.run(id);
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error deleting member:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // ipcMain.handle('searchMembers', async (event, query) => {
// // // // // // //   try {
// // // // // // //     const stmt = db.prepare(`
// // // // // // //       SELECT * FROM members
// // // // // // //       WHERE status = 'Active'
// // // // // // //       AND (fullName LIKE ? OR contact LIKE ?)
// // // // // // //     `);
// // // // // // //     return stmt.all(`%${query}%`, `%${query}%`);
// // // // // // //   } catch (error) {
// // // // // // //     console.error('Error searching members:', error);
// // // // // // //     throw error;
// // // // // // //   }
// // // // // // // });

// // // // // // // const createWindow = () => {
// // // // // // //   const mainWindow = new BrowserWindow({
// // // // // // //     width: 800,
// // // // // // //     height: 600,
// // // // // // //     webPreferences: {
// // // // // // //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// // // // // // //       contextIsolation: true,
// // // // // // //       enableRemoteModule: false,
// // // // // // //       nodeIntegration: false,
// // // // // // //     },
// // // // // // //   });

// // // // // // //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// // // // // // //   mainWindow.webContents.openDevTools();
// // // // // // // };

// // // // // // // app.whenReady().then(() => {
// // // // // // //   createWindow();

// // // // // // //   app.on('activate', () => {
// // // // // // //     if (BrowserWindow.getAllWindows().length === 0) {
// // // // // // //       createWindow();
// // // // // // //     }
// // // // // // //   });
// // // // // // // });

// // // // // // // app.on('window-all-closed', () => {
// // // // // // //   if (process.platform !== 'darwin') {
// // // // // // //     db.close();
// // // // // // //     app.quit();
// // // // // // //   }
// // // // // // // });









// // // // // // // // const { app, BrowserWindow, ipcMain } = require('electron');
// // // // // // // // const path = require('node:path');
// // // // // // // // const Database = require('better-sqlite3');

// // // // // // // // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // // // // // // // if (require('electron-squirrel-startup')) {
// // // // // // // //   app.quit();
// // // // // // // // }

// // // // // // // // // Initialize SQLite database
// // // // // // // // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // // // // // // // const db = new Database(dbPath);

// // // // // // // // // Create tables
// // // // // // // // db.exec(`
// // // // // // // //   CREATE TABLE IF NOT EXISTS todos (
// // // // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // // // //     text TEXT NOT NULL,
// // // // // // // //     done INTEGER DEFAULT 0
// // // // // // // //   );
// // // // // // // //   CREATE TABLE IF NOT EXISTS members (
// // // // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // // // //     accountOpenDate TEXT,
// // // // // // // //     fullName TEXT NOT NULL,
// // // // // // // //     height TEXT,
// // // // // // // //     weight TEXT,
// // // // // // // //     relativeType TEXT,
// // // // // // // //     relativeName TEXT,
// // // // // // // //     gender TEXT,
// // // // // // // //     contact TEXT,
// // // // // // // //     address TEXT,
// // // // // // // //     status TEXT,
// // // // // // // //     dayTiming TEXT,
// // // // // // // //     time TEXT
// // // // // // // //   )
// // // // // // // // `);

// // // // // // // // // IPC handlers for todos
// // // // // // // // ipcMain.handle('getTodos', async () => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare('SELECT * FROM todos');
// // // // // // // //     return stmt.all();
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error fetching todos:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // ipcMain.handle('addTodo', async (event, text) => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
// // // // // // // //     const result = stmt.run(text);
// // // // // // // //     return result.lastInsertRowid;
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error adding todo:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // ipcMain.handle('toggleTodo', async (event, id) => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare('UPDATE todos SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?');
// // // // // // // //     stmt.run(id);
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error toggling todo:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // // IPC handlers for members
// // // // // // // // ipcMain.handle('getMembers', async () => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare('SELECT * FROM members');
// // // // // // // //     return stmt.all();
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error fetching members:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // ipcMain.handle('addMember', async (event, member) => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare(`
// // // // // // // //       INSERT INTO members (
// // // // // // // //         accountOpenDate, fullName, height, weight, relativeType, relativeName,
// // // // // // // //         gender, contact, address, status, dayTiming, time
// // // // // // // //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// // // // // // // //     `);
// // // // // // // //     const result = stmt.run(
// // // // // // // //       member.accountOpenDate,
// // // // // // // //       member.fullName,
// // // // // // // //       member.height,
// // // // // // // //       member.weight,
// // // // // // // //       member.relativeType,
// // // // // // // //       member.relativeName,
// // // // // // // //       member.gender,
// // // // // // // //       member.contact,
// // // // // // // //       member.address,
// // // // // // // //       member.status,
// // // // // // // //       member.dayTiming,
// // // // // // // //       member.time
// // // // // // // //     );
// // // // // // // //     return result.lastInsertRowid;
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error adding member:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // ipcMain.handle('updateMember', async (event, member) => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare(`
// // // // // // // //       UPDATE members SET
// // // // // // // //         accountOpenDate = ?, fullName = ?, height = ?, weight = ?,
// // // // // // // //         relativeType = ?, relativeName = ?, gender = ?, contact = ?,
// // // // // // // //         address = ?, status = ?, dayTiming = ?, time = ?
// // // // // // // //       WHERE id = ?
// // // // // // // //     `);
// // // // // // // //     stmt.run(
// // // // // // // //       member.accountOpenDate,
// // // // // // // //       member.fullName,
// // // // // // // //       member.height,
// // // // // // // //       member.weight,
// // // // // // // //       member.relativeType,
// // // // // // // //       member.relativeName,
// // // // // // // //       member.gender,
// // // // // // // //       member.contact,
// // // // // // // //       member.address,
// // // // // // // //       member.status,
// // // // // // // //       member.dayTiming,
// // // // // // // //       member.time,
// // // // // // // //       member.id
// // // // // // // //     );
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error updating member:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // ipcMain.handle('deleteMember', async (event, id) => {
// // // // // // // //   try {
// // // // // // // //     const stmt = db.prepare('DELETE FROM members WHERE id = ?');
// // // // // // // //     stmt.run(id);
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('Error deleting member:', error);
// // // // // // // //     throw error;
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // const createWindow = () => {
// // // // // // // //   console.log('icon:- ', path.join(__dirname, "assets", "dumbell.ico"))
// // // // // // // //   const mainWindow = new BrowserWindow({
// // // // // // // //     width: 800,
// // // // // // // //     height: 600,
// // // // // // // //     icon: path.join(__dirname, "assets", "dumbell.ico"),
// // // // // // // //     webPreferences: {
// // // // // // // //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// // // // // // // //       contextIsolation: true,
// // // // // // // //       enableRemoteModule: false,
// // // // // // // //       nodeIntegration: false,
// // // // // // // //     },
// // // // // // // //   });

// // // // // // // //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// // // // // // // //   mainWindow.webContents.openDevTools();
// // // // // // // // };

// // // // // // // // app.whenReady().then(() => {
// // // // // // // //   createWindow();

// // // // // // // //   app.on('activate', () => {
// // // // // // // //     if (BrowserWindow.getAllWindows().length === 0) {
// // // // // // // //       createWindow();
// // // // // // // //     }
// // // // // // // //   });
// // // // // // // // });

// // // // // // // // app.on('window-all-closed', () => {
// // // // // // // //   if (process.platform !== 'darwin') {
// // // // // // // //     db.close();
// // // // // // // //     app.quit();
// // // // // // // //   }
// // // // // // // // });







// // // // // // // // // const { app, BrowserWindow, ipcMain } = require('electron');
// // // // // // // // // const path = require('node:path');
// // // // // // // // // const Database = require('better-sqlite3');

// // // // // // // // // // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// // // // // // // // // if (require('electron-squirrel-startup')) {
// // // // // // // // //   app.quit();
// // // // // // // // // }

// // // // // // // // // // Initialize SQLite database
// // // // // // // // // const dbPath = path.join(app.getPath('userData'), 'todos.db');
// // // // // // // // // const db = new Database(dbPath);

// // // // // // // // // // Create todos table if it doesn't exist
// // // // // // // // // db.exec(`
// // // // // // // // //   CREATE TABLE IF NOT EXISTS todos (
// // // // // // // // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // // // // // // // //     text TEXT NOT NULL,
// // // // // // // // //     done INTEGER DEFAULT 0
// // // // // // // // //   )
// // // // // // // // // `);

// // // // // // // // // const createWindow = () => {
// // // // // // // // //   const mainWindow = new BrowserWindow({
// // // // // // // // //     width: 800,
// // // // // // // // //     height: 600,
// // // // // // // // //     webPreferences: {
// // // // // // // // //       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
// // // // // // // // //       contextIsolation: true, // Ensure context isolation is enabled
// // // // // // // // //       enableRemoteModule: false, // Disable remote module for security
// // // // // // // // //       nodeIntegration: false, // Disable nodeIntegration for security
// // // // // // // // //     },
// // // // // // // // //   });

// // // // // // // // //   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// // // // // // // // //   mainWindow.webContents.openDevTools();
// // // // // // // // // };

// // // // // // // // // // IPC handlers for todo operations
// // // // // // // // // ipcMain.handle('getTodos', () => {
// // // // // // // // //   const stmt = db.prepare('SELECT * FROM todos');
// // // // // // // // //   return stmt.all();
// // // // // // // // // });

// // // // // // // // // ipcMain.handle('addTodo', (event, text) => {
// // // // // // // // //   const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
// // // // // // // // //   const result = stmt.run(text);
// // // // // // // // //   return result.lastInsertRowid;
// // // // // // // // // });

// // // // // // // // // ipcMain.handle('toggleTodo', (event, id) => {
// // // // // // // // //   const stmt = db.prepare('UPDATE todos SET done = CASE done WHEN 0 THEN 1 ELSE 0 END WHERE id = ?');
// // // // // // // // //   stmt.run(id);
// // // // // // // // // });

// // // // // // // // // app.whenReady().then(() => {
// // // // // // // // //   createWindow();

// // // // // // // // //   app.on('activate', () => {
// // // // // // // // //     if (BrowserWindow.getAllWindows().length === 0) {
// // // // // // // // //       createWindow();
// // // // // // // // //     }
// // // // // // // // //   });
// // // // // // // // // });

// // // // // // // // // app.on('window-all-closed', () => {
// // // // // // // // //   if (process.platform !== 'darwin') {
// // // // // // // // //     db.close(); // Close the database connection
// // // // // // // // //     app.quit();
// // // // // // // // //   }
// // // // // // // // // });