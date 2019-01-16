const _clients = [];

const specifiedKeysForMessage = ['channel', 'data', 'text', 'type'];

let arrWithoutProperties = (arr, keys) => {
    let newArr = [];
    for (let j=0; j<arr.length; j++) {
        let target = {};
        for (let i in arr[j]) {
            if (keys.indexOf(i) >= 0)
                continue;
            if (!Object.prototype.hasOwnProperty.call(arr[j], i))
                continue;
            target[i] = arr[j][i];
        }
        if (Object.keys(target).length > 1)
            newArr.push(target);
        else newArr.push(target[Object.keys(target)[0]])
    }
    return newArr;
};

let broadcast = (message) => {
    for (let key of specifiedKeysForMessage) {
        if (typeof message[key] === 'undefined') {
            console.error('\'Message\' object has undefined property ' + key
                + '. Check object properties');
            return;
        }
    }
    _clients.forEach((client) =>{
        client.connection.send(JSON.stringify(message));
    });
};

let getClients = () => arrWithoutProperties(_clients, ['connection']);


module.exports = {
    add: (client, message) => {
        _clients.push(client);
        broadcast({
            channel: 'usersOnline',
            data: getClients(),
            text: {
                body: 'Пользователь ' + client.nickname + ' подключился к чату'
            },
            type: 'info'
        });
    },
    getConnections: () =>
        arrWithoutProperties(_clients, ['id', 'nickname']),
    remove: (client) => {
        for(let i=0; i<_clients.length; i++) {
            if (_clients[i].id === client.id)
                _clients.splice(i, 1);
        }
        broadcast({
            channel: 'usersOnline',
            data: getClients(),
            text: {
                body: 'Пользователь ' + client.nickname + ' покинул чат'
            },
            type: 'info'
        });
    },
    /**
     * @param message (must contain properties:
     * channel,
     * data,
     * text,
     * type)
     */
    broadcast,
    getLength: () => _clients.length
};