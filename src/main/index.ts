import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Налаштування логування
autoUpdater.logger = log
// @ts-ignore
autoUpdater.logger.transports.file.level = 'info'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false // Прапор, щоб відрізнити закриття вікна від виходу з програми

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200, // Трохи збільшив для адмінки
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // ПЕРЕХОПЛЕННЯ ЗАКРИТТЯ: згортаємо замість виходу
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
    return false
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

// --- СИСТЕМНИЙ ТРЕЙ ---

function createTray(): void {
  const trayIcon = nativeImage.createFromPath(icon)
  // Для Windows трей зазвичай 16x16 або 32x32
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Відкрити ICTAPP',
      click: (): void => { mainWindow?.show() }
    },
    { type: 'separator' },
    {
      label: 'Вийти',
      click: (): void => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('ICTAPP Tender Platform')
  tray.setContextMenu(contextMenu)

  // Відкрити при подвійному кліку
  tray.on('double-click', () => {
    mainWindow?.show()
  })
}

// --- ЛОГІКА АВТООНОВЛЕНЬ ---

autoUpdater.on('update-available', () => {
  mainWindow?.webContents.send('update-status', 'Знайдено оновлення, завантажуємо...')
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.webContents.send('update-progress', progressObj.percent)
})

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('update-ready')
})

ipcMain.on('install-update', () => {
  isQuitting = true // Дозволяємо вихід для встановлення
  autoUpdater.quitAndInstall()
})

// --- ЖИТТЄВИЙ ЦИКЛ ---

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray() // Ініціалізуємо трей

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else mainWindow?.show()
  })
})

// На Windows/Linux програма не закривається при закритті вікон
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Ми не викликаємо app.quit(), щоб програма лишалася в треї
  }
})

// Дозволяємо вихід при вимиканні системи
app.on('before-quit', () => {
  isQuitting = true
})
