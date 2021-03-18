const path = require('path');
const {app, BrowserWindow} = require('electron');
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const $ = require('jquery');

function path_check(){
  if(process.env.SPOTIFY_CLIENT_ID) {
    console.log('[+] SPOTIFY_CLIENT_ID is set.');
  }
  else {
      console.log('[+] SPOTIFY_CLIENT_ID is not in path.');
      app.exit(0)
  }
  if(process.env.SPOTIFY_CLIENT_SECRET) {
    console.log('[+] SPOTIFY_CLIENT_SECRET is set.');
  }
  else {
      console.log('[+] SPOTIFY_CLIENT_SECRET is not in path.');
      app.exit(0)
  }

}
path_check();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let subpy = null;
const PY_DIST_FOLDER = "dist-python"; // python distributable folder
const PY_MODULE = (path.join(__dirname, 'server/server.py')); // the name of the main module

const isRunningInBundle = () => {
  return require("fs").existsSync(path.join(__dirname, PY_DIST_FOLDER));
};

const getPythonScriptPath = () => {
  if (!isRunningInBundle()) {
    return PY_MODULE
  }
  if (process.platform === "win32") {
    return path.join(
      __dirname,
      PY_DIST_FOLDER,
      PY_MODULE.slice(0, -3) + ".exe"
    );
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE);
};


const startPythonSubprocess = () => {
  let script = getPythonScriptPath();
  if (isRunningInBundle()) {
    subpy = require("child_process").execFile(script, []);
  } else {
    subpy = require("child_process").spawn("python3", [script]);
  }
};

const killPythonSubprocesses = main_pid => {
  const python_script_name = path.basename(getPythonScriptPath());
  let cleanup_completed = false;
  const psTree = require("ps-tree");
  psTree(main_pid, function(err, children) {
    let python_pids = children
      .filter(function(el) {
        return el.COMMAND == python_script_name;
      })
      .map(function(p) {
        return p.PID;
      });
    // kill all the spawned python processes
    python_pids.forEach(function(pid) {
      process.kill(pid);
    });
    subpy = null;
    cleanup_completed = true;
  });
  return new Promise(function(resolve, reject) {
    (function waitForSubProcessCleanup() {
      if (cleanup_completed) return resolve();
      setTimeout(waitForSubProcessCleanup, 30);
    })();
  });
};


function createWindow () {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 420,
    height: 200,
    resizeable: false,
    fullscreen: false,
    maximizable: false,
    transparent: true,
    frame:false,
    webPreferences: {
      nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
  }
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));


  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  mainWindow.setAlwaysOnTop(true, "floating", 1);
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on("ready", function() {
  // start the backend server
  startPythonSubprocess();
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    let main_process_pid = process.pid;
    killPythonSubprocesses(main_process_pid).then(() => {
      app.quit();
    });
  }
});


app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
