const moment = require('moment')
const mustache = require('mustache')

import * as templates from './message-templates'

export const generateNotificationHTML = ({ text, username, createdAt }) => {
    return mustache.render(templates.notification, {
        username,
        text,
        createdAt: getFormatedTime(createdAt)
    })
}

export const generateMessageHTML = ({ text, username, createdAt }) => {
    return mustache.render(templates.message, {
        username,
        text,
        createdAt: getFormatedTime(createdAt)
    })
}

export const generateLocationHTML = ({ username, url, createdAt }) => {
    return mustache.render(templates.location, {
        username,
        url,
        createdAt: getFormatedTime(createdAt)
    })
}

const getFormatedTime = (timestamp) => {
    return moment(timestamp).format('h:mm a')
}