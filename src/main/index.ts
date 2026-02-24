import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

autoUpdater.logger = log
// @ts-ignore
autoUpdater.logger.transports.file.level = 'info'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    // Перевірка при запуску
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

function createTray(): void {
  const trayIcon = nativeImage.createFromPath(icon)
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Відкрити ICTAPP', click: () => mainWindow?.show() },
    { type: 'separator' },
    { label: 'Вийти', click: () => { isQuitting = true; app.quit() } }
  ])
  tray.setToolTip('ICTAPP Tender Platform')
  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => mainWindow?.show())
}

// --- ЛОГІКА АВТООНОВЛЕНЬ (БЕЗПЕЧНА) ---
const sendToWebContents = (channel: string, ...args: any[]) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args)
  }
}

autoUpdater.on('update-available', () => {
  sendToWebContents('update-status', 'Знайдено оновлення, завантажуємо...')
})

autoUpdater.on('download-progress', (progressObj) => {
  sendToWebContents('update-progress', progressObj.percent)
})

autoUpdater.on('update-downloaded', () => {
  sendToWebContents('update-ready')
})

ipcMain.on('install-update', () => {
  isQuitting = true
  autoUpdater.quitAndInstall()
})

app.whenReady().then(() => {
  // Вказуй свій appId з package.json
  electronApp.setAppUserModelId('com.tatarynrm.ictapp')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()

  // Фонова перевірка кожні 15 хвилин
  setInterval(() => {
    if (!is.dev) autoUpdater.checkForUpdates()
  }, 15 * 60 * 1000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else mainWindow?.show()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { /* Програма лишається в треї */ }
})

app.on('before-quit', () => { isQuitting = true })
