const socket = require('socket.io-client')()
const mustache = require('mustache')

import Qs from 'qs'
import * as messages from './utils/messages'

// Elements
const $messageForm = document.getElementById('new-message-form')
const $messageSubmit = document.getElementById('new-message-submit')
const $sendLocationButton = document.getElementById('send-location-button')
const $messages = document.getElementById('messages')
const $sidebar = document.getElementById('sidebar')

// Templates
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const viewportHeight = $messages.offsetHeight
    const contentHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + viewportHeight

    if (contentHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = contentHeight
    }
}

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('notification', (notification) => {
    $messages.insertAdjacentHTML(
        'beforeend', 
        messages.generateNotificationHTML(notification))

    autoscroll()
})

socket.on('message', (message) => {
    $messages.insertAdjacentHTML(
        'beforeend', 
        messages.generateMessageHTML(message))
    
    autoscroll()
})

socket.on('location', (location) => {    
    $messages.insertAdjacentHTML(
        'beforeend', 
        messages.generateLocationHTML(location))

    autoscroll()
})

socket.on('roomUpdated', ({ room, users }) => {
    $sidebar.innerHTML = mustache.render(sidebarTemplate, {
        room,
        users
    })
})

$messageForm.addEventListener('submit', e => {
    e.preventDefault()
    
    const messageInput = e.target.elements.message
    const text = messageInput.value

    if (text.length === 0) {
        return
    }

    $messageSubmit.disabled = true
    messageInput.value = ''

    socket.emit('message', text, (serverMessage) => {
        $messageSubmit.disabled = false
        messageInput.focus()

        console.log(
            'The message was delivered!', 
            'Server replied:', 
            serverMessage)
    })
})

$sendLocationButton.addEventListener('click' , () => {
    $sendLocationButton.disabled = true
    
    if (!navigator.geolocation) {
        return console.error('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit(
            'location', 
            { 
                latitude: pos.coords.latitude, 
                longitude: pos.coords.longitude 
            }, 
            (serverMessage) => {
                $sendLocationButton.disabled = false

                console.log(
                    'The location was delivered!', 
                    'Server replied:', 
                    serverMessage)
            })
    })
})