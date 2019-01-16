import React from 'react';
import '../css/styles.css';

class Messages extends React.Component {

    wrapMessagesInHtml = (message, i) => {
        const info = {
            color: '#828282',
            fontStyle: 'italic',
            display: 'flex',
            justifyContent: 'center',
            padding: '0px'
        };
        const messageStyle = {
            fontSize: '24px',
            padding: '5px',
            wordWrap: 'break-word'
        };

        if (message.type === 'info'){
            Object.assign(messageStyle, info);
            return <div style={messageStyle} key={i}>
                {message.text}
            </div>
        }
        else return <div style={messageStyle} key={i}>
            <img src={message.data.avatar} alt={'Error'} /> {message.data.nickname}: {message.text}
        </div>
    };

    render() {

        const messagesDiv = {
            height: '80vh',
            overflow: 'scroll',
            overflowX: 'hidden',
            overflowY: 'auto',
            margin: '5px'
        };

        const messages = this.props.messages.map((message, i) => this.wrapMessagesInHtml(message, i));
        return <div style={messagesDiv}>{messages}</div>;
    }
}

export default Messages;