const users = []

const add = ({ id, username, room }) => {
    username = username.trim()
    room = room.trim()

    const _username = username.toLowerCase()
    const _room = room.toLowerCase()

    if (!_username || !_room){
        return {
            error: 'Username and room are required.'
        }
    }

    const existingUser = users.find(u => 
        u._room === _room && u._username === _username)

    if (existingUser) {
        return {
            error: 'Username is in use.'
        }
    }

    users.push({ id, username, _username, room, _room })

    return { user: { id, username, room } }
}

const remove = (id) => {
    const index = users.findIndex(u => u.id === id)

    if (index >= 0 ) {
        return users.splice(index, 1)[0]
    }    
}

const get = (id) => {
    return users.find(u => u.id === id)
}

const getAllInRoom = (room) => {
    _room = room.trim().toLowerCase()

    return users.filter(u => u._room === _room)
}

module.exports = {
    addUser: add,
    removeUser: remove,
    getUser: get,
    getUsersInRoom: getAllInRoom

}