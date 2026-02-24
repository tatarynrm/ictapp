import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log' // Використовуємо import замість require

// 1. Налаштування логування (вирішує проблему з 'possibly null')
autoUpdater.logger = log
// @ts-ignore (якщо TS все ще свариться на типи логера)
autoUpdater.logger.transports.file.level = 'info'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()

    if (!is.dev) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// --- ЛОГІКА АВТООНОВЛЕНЬ (винесена окремо) ---

autoUpdater.on('update-available', () => {
  mainWindow?.webContents.send('update-status', 'Знайдено оновлення, завантажуємо...')
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.webContents.send('update-progress', progressObj.percent)
})

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('update-ready')
})

// Команда від React на примусове встановлення
ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})

// --- ЖИТТЄВИЙ ЦИКЛ ДОДАТКУ ---

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
