const generateMessage = ({ username }, text) => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}

const generateNotificationMessage = (text) => {
    return {
        type: 'notification',
        ...generateMessage({ username: 'ServerBot 🤖'}, text)
    }
}

const generateLocationMessage = ({ username }, { latitude, longitude }) => {
    return {
        type: 'location',
        username,
        url: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateNotificationMessage,
    generateLocationMessage
}