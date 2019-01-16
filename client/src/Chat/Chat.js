import React from 'react';
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import Login from './Login';
import UserOnline from "./UserOnline";
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';
import Cookies from 'universal-cookie';

function reverseString(s){
    return s.split("").reverse().join("");
}



class Chat extends React.Component{

    constructor(props) {
        super(props);
        this.cookies = new Cookies();
        this._ROOM_NAV_NAME = 'ROOM';
        this._ROOM_MESSAGE_STORE = 'ROOM';
        this.roomMessages = [];
        this.privateMessages = {};
        this.state = {
            sockets: [],
            currentSocket: null,
            nav: [],
            usersOnline: [],
            messages: [],
            currentNav: ''
        };
    }

    connectToRoom = (nickname) => {
        const socket = openSocket(`http://127.0.0.1:5000?nickname=${nickname}`);
        socket.on('cookiesReceived', message => {
            this.cookies.set('id', message.data.id);
            this.cookies.set('nickname', message.data.nickname);
            this.cookies.set('avatar', message.data.avatar);
        });
        socket.on('userConnected', (message) => {
            console.log('Websocket: broadcast from \'connected\' channel:', message);
            if (!this.state.sessionId)
                this.setState({sessionId: this.cookies.get('id')});
            this.setState({usersOnline: message.data.usersOnline});
            this.roomMessages.push(message);
            // if (window.location.pathname === '/')
            if (this.state.currentNav === '')
                this.setState({
                    messages: this.roomMessages,
                    sockets: this.state.sockets.concat(socket),
                    currentSocket: socket,
                });
            this.updateNav({
                navName: this._ROOM_NAV_NAME,
                messagesStore: this._ROOM_MESSAGE_STORE,
                socket,
            });
        });
        socket.on('message', (message) => {
            console.log('Websocket: broadcast from \'room\' namespace \'message\' channel:', message);
            this.roomMessages.push(message);
            // if (window.location.pathname === '/')
            if (this.state.currentNav === '')
                this.setState({
                    messages: this.roomMessages,
                });
        });
        socket.on('join', (message) => {
            console.log('Websocket: broadcast from \'join\' channel:', message);
            // this.updateUsersOnline(message.data.usersOnline);
            let partner = {
                id: message.data.id,
                nickname: message.data.navName
            };
            this.connectToPrivate(partner, true)
        });
        socket.on('userDisconnected', (message) => {
            console.log('Websocket: broadcast from \'userDisconnected\' channel:', message);
            this.setState({usersOnline: message.data.usersOnline});
            this.roomMessages.push(message);
            // if (window.location.pathname === '/')
            if (this.state.currentNav === '')
                this.setState({
                    messages: this.roomMessages,
                });
            // this.disablePrivates();
        });
    };
    connectToPrivate = (partner, isReverse=false) => {
        console.log('PARTNER', partner);
        let conversationId = (this.cookies.get('id') + '-' + partner.id);
        if (isReverse)
            conversationId = reverseString(conversationId);
        const socket = openSocket(`http://127.0.0.1:5000?conversationId=${conversationId}&id=${this.cookies.get('id')}
        &nickname=${this.cookies.get('nickname')}&avatar=${this.cookies.get('avatar')}`);
        console.log('PRIVATE', this.privateMessages);
        if (this.privateMessages[reverseString(conversationId)]) {
            // this.privateMessages[conversationId] = [];
            conversationId = reverseString(conversationId);
        }
        socket.on('established', (message) => {
            console.log('Websocket: broadcast \'established\' channel:', message);
            this.updateNav({
                navName: partner.nickname,
                messagesStore: conversationId,
                socket,
            });
            if (!this.privateMessages[conversationId])
                this.privateMessages[conversationId] = [];
            this.privateMessages[conversationId].push(message);
            // if (window.location.pathname === `/${conversationId}`)
            if (this.state.currentNav === conversationId)
                this.setState({
                    messages: this.privateMessages[conversationId],
                    currentSocket: socket
                });
            // let reversedConversationId = reverseString(conversationId);
            // if (this.privateMessages[reversedConversationId]) {
            //     conversationId = reversedConversationId;
            //     this.privateMessages[conversationId].push(message)
            // }
            // else {
            //     if (!this.privateMessages[conversationId])
            //         this.privateMessages[conversationId] = [];
            //     this.privateMessages[conversationId].push(message);
            // }
            // // if (window.location.pathname === `/${conversationId}`)
            // if (this.state.currentNav === conversationId)
            //     this.setState({
            //         messages: this.privateMessages[conversationId],
            //         currentSocket: socket
            //     });
        });
        socket.on('privateMessage', (message) => {
            console.log('Websocket: broadcast from \'privateMessage\' channel:', message);
            if (!this.privateMessages[conversationId])
                this.privateMessages[conversationId] = [];
            this.privateMessages[conversationId].push(message);
            // if (window.location.pathname === `/${conversationId}`)
            if (this.state.currentNav === conversationId)
                this.setState({
                    messages: this.privateMessages[conversationId],
                });
            this.updateNav({
                navName: partner.nickname,
                messagesStore: conversationId,
                socket,
            });
        });
        socket.on('demolished', (message) => {
            console.log('Websocket: broadcast from \'demolished\' channel:', message);
            this.state.currentSocket.disconnect();
            this.privateMessages[conversationId].push(message);
            // if (window.location.pathname === `/${conversationId}`)
            if (this.state.currentNav === conversationId)
                this.setState({
                    messages: this.privateMessages[conversationId],
                });
            // this.privateMessages[conversationId] = [];
            // this.state.currentSocket.disconnect()
        });
    };
    sendToServer = (text) => {
        let message = {
            data: {
                nickname: this.cookies.get('nickname'),
                avatar: this.cookies.get('avatar')
            },
            text
        };
        this.state.currentSocket.emit('message', message);
    };
    updateNav = (nav) => {
        console.log('UPDATE NAV', nav, this.state.nav);
        for (let navSaved of this.state.nav) {
            if (navSaved.messagesStore === nav.messagesStore)
                return;
        }
        // nav.active = false;
        this.setState({nav: this.state.nav.concat(nav)})
    };
    disablePrivates = () => {
        let newNav = this.state.nav;
        let id = this.cookies.get('id');
        newNav.forEach(item => {
            if (item.messagesStore.indexOf(id) !== -1) {
                this.privateMessages[id] = this.privateMessages[item.messagesStore];
                item.messagesStore = id;
            }
        });
        this.setState({nav: newNav})
    };

    handleClickNav = (item) => {
        if (item.messagesStore === this._ROOM_MESSAGE_STORE)
            this.setState({
                messages: this.roomMessages
            });
        else this.setState({
            messages: this.privateMessages[item.messagesStore]
        });
        this.setState({currentSocket: item.socket});
        let newNav = this.state.nav.map(elem => {
            elem.active = item.messagesStore === elem.messagesStore;
            return elem;
        });
        this.setState({
            nav: newNav,
            currentNav: item.navName === this._ROOM_NAV_NAME? '': item.messagesStore
        });
    };

    handleCloseNav = (divId) => {
        // this.state.currentSocket.disconnect();
        // console.log('CUR_SOCKET', this.state.currentSocket);
        let newNav = this.state.nav.filter(item => {
            console.log(item.messagesStore, divId);
            return item.messagesStore !== divId
        });
        let lastItem = newNav[newNav.length-1];
        console.log('LAST_ITEm', lastItem);
        this.handleClickNav(lastItem)
        this.setState({nav: newNav});

    };

    render() {
        console.log('NAVS', this.state.nav);
        const nav = this.state.nav.map((item, i) => {
            const navStyle = {
                display: 'flex',
                justifyContent: 'center',
                marginLeft: '5px',
                marginRight: '5px',
                paddingLeft: '5px',
                paddingRight: '5px',
                border: item.active? 'black 1px solid': ''
            };
            return (
                <div id={item.messagesStore} style={navStyle} key={i}>
                    <button className="nav-item nav-link"
                          onClick={() => this.handleClickNav(item)}>{item.navName}</button>
                    <a href={'#'} style={{textDecoration: 'none', color:'black'}}
                       onClick={() => this.handleCloseNav(item.messagesStore)}>&times;</a>
                </div>
            )
        });
        const usersOnline = this.state.usersOnline.map((user, i) => {
            user.nickname += user.id === parseInt(this.cookies.get('id')) && user.nickname.indexOf('(Вы)') === -1? ' (Вы)': '';

            return <UserOnline key={i} user={user} sessionId={this.state.sessionId} roomName={this._ROOM_NAV_NAME}
                               connectToPrivate={this.connectToPrivate} />
        });
        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <h3>Chat</h3>
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {nav}
                        </div>
                    </div>
                </nav>
                <Login connectToRoom={this.connectToRoom}/>
                <div className='usersOnlineStyle'>
                    <p style={{fontWeight: 'bold'}}>Пользователи в комнате "{this._ROOM_NAV_NAME}": </p>
                    {usersOnline}
                </div>
                <Messages messages={this.state.messages}/>
                <ChatInput currentSocket={this.state.currentSocket} sendToServer={this.sendToServer} />
            </div>
        );
    }
}

export default Chat;