const connectScreen = document.getElementById('connect-screen')
const connectForm = document.getElementById('connect-form')
const serverUrlInput = document.getElementById('server-url')
const connectionsList = document.getElementById('connections-list')

const mainApp = document.getElementById('main-app')
const form = document.getElementById('go')
const input = document.getElementById('url')
const frame = document.getElementById('viewer')
const backBtn = document.getElementById('back')
const reloadBtn = document.getElementById('reload')
const homeBtn = document.getElementById('home')
const domainSpan = document.getElementById('domain')

// async function pedirPermisoMicrofono() {
//   try {
//     await navigator.mediaDevices.getUserMedia({ audio: true });
//     console.log('Permiso de micrófono concedido');
//   } catch (error) {
//     alert('Necesitamos acceso al micrófono para las llamadas de voz');
//   }
// }

// document.addEventListener('DOMContentLoaded', pedirPermisoMicrofono);


let history = JSON.parse(localStorage.getItem('exnetHistory') || '[]')
let index = history.length ? history.length - 1 : -1
let serverUrl = localStorage.getItem('exnetServerUrl')

let recentConnections = JSON.parse(localStorage.getItem('exnetRecentConnections') || '[]')

function displayRecentConnections() {
  connectionsList.innerHTML = ''

  const connectionsToShow = recentConnections

  if (connectionsToShow.length === 0) {

    const emptyItem = document.createElement('li')
    emptyItem.textContent = 'No hay conexiones recientes'
    emptyItem.style.color = '#94a3b8'
    emptyItem.style.fontStyle = 'italic'
    emptyItem.style.padding = '0.5rem 0'
    connectionsList.appendChild(emptyItem)
    return
  }

  connectionsToShow.forEach(connection => {
    const listItem = document.createElement('li')
    const link = document.createElement('a')
    link.href = '#'
    link.textContent = connection

    link.addEventListener('click', (e) => {
      e.preventDefault()
      connectToServer(connection)
    })

    listItem.appendChild(link)
    connectionsList.appendChild(listItem)
  })
}

function addToRecentConnections(url) {

  recentConnections = recentConnections.filter(conn => conn !== url)

  recentConnections.unshift(url)

  localStorage.setItem('exnetRecentConnections', JSON.stringify(recentConnections))

  displayRecentConnections()
}

function connectToServer(serverAddress) {

  localStorage.setItem('exnetServerUrl', serverAddress)

  addToRecentConnections(serverAddress)

  if (history.length === 0) {
    history.push(serverAddress)
    index = 0
    save()
  }

  connectScreen.classList.add('hidden')
  mainApp.classList.remove('hidden')

  load(serverAddress)
}

function initApp() {

  connectScreen.classList.remove('hidden');
  mainApp.classList.add('hidden');

  displayRecentConnections();

  if (serverUrl) {
    serverUrlInput.value = serverUrl;
  }

  updateNav();
}

document.addEventListener('DOMContentLoaded', initApp);

function adjustMobileInterface() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {

    document.body.style.paddingTop = '0';

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {

      document.body.classList.add('ios-device');
    }
  }
}

document.addEventListener('DOMContentLoaded', adjustMobileInterface);

window.addEventListener('orientationchange', adjustMobileInterface);

if (!serverUrl) {

  connectScreen.classList.remove('hidden')
  mainApp.classList.add('hidden')

  displayRecentConnections()
} else {

  connectScreen.classList.remove('hidden')
  mainApp.classList.add('hidden')

  serverUrlInput.value = serverUrl

  displayRecentConnections()

  updateNav()
}

connectForm.addEventListener('submit', e => {
  e.preventDefault()
  let serverAddress = serverUrlInput.value.trim()

  if (serverAddress) {
    connectToServer(serverAddress)
  }
})

form.addEventListener('submit', e => {
  e.preventDefault()
  let v = input.value.trim()

  if (index === history.length - 1) {
    history.push(v)
    index++
  } else {
    history.splice(index + 1)
    history.push(v)
    index = history.length - 1
  }

  save()
  load(v)
})

backBtn.addEventListener('click', () => {
  if (index > 0) {
    index--
    save()
    load(history[index])
  }
})

reloadBtn.addEventListener('click', () => {
  if (index >= 0) load(history[index])
})

homeBtn.addEventListener('click', () => {

  const homeUrl = localStorage.getItem('exnetServerUrl') || 'https://google.es'

  if (index === history.length - 1) {
    history.push(homeUrl)
    index++
  } else {
    history.splice(index + 1)
    history.push(homeUrl)
    index = history.length - 1
  }
  save()
  load(homeUrl)
})

function load(url) {
  frame.src = url
  input.value = url
  try {
    const parsed = new URL(url)
    domainSpan.textContent = parsed.hostname
  } catch (e) {

    domainSpan.textContent = url
  }
  updateNav()
}

function updateNav() {
  backBtn.disabled = index <= 0
}

function save() {
  localStorage.setItem('exnetHistory', JSON.stringify(history))
}