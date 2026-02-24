import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

autoUpdater.logger = log
// @ts-ignore
autoUpdater.logger.transports.file.level = 'info'

// НАЛАШТУВАННЯ АВТОМАТИЗАЦІЇ
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

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
    if (!is.dev) autoUpdater.checkForUpdatesAndNotify()
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

const sendToUi = (channel: string, ...args: any[]) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args)
  }
}

// ЛОГІКА ОНОВЛЕНЬ
autoUpdater.on('update-available', () => {
  log.info('Update available. Downloading...')
  sendToUi('update-status', 'Завантажуємо нову версію у фоні...')
})

autoUpdater.on('download-progress', (progress) => {
  sendToUi('update-progress', progress.percent)
})

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded.')
  sendToUi('update-ready')

  // Якщо вікно приховане (в треї) — оновлюємо миттєво
  if (mainWindow && !mainWindow.isVisible()) {
    isQuitting = true
    autoUpdater.quitAndInstall(false, true)
  }
})

ipcMain.on('install-update', () => {
  isQuitting = true
  autoUpdater.quitAndInstall()
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.tatarynrm.ictapp')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))

  createWindow()
  createTray()

  // Перевірка кожні 10 хвилин
  setInterval(() => {
    if (!is.dev) autoUpdater.checkForUpdates()
  }, 10 * 60 * 1000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else mainWindow?.show()
  })
})

app.on('before-quit', () => { isQuitting = true })
