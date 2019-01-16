import React from 'react';

class ChatInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textareaVal: ''
        };
    }

    handleChange = (event) => {
        this.setState({textareaVal: event.target.value})
    };

    handleKeyPressed = (event) => {
        if (event.key !== 'Enter') return false;
        this.handleClick();
        event.preventDefault();
    };

    handleClick = () => {
        if (this.state.textareaVal === '')
            return;
        this.props.sendToServer(this.state.textareaVal);
        this.setState({textareaVal: ''});
    };

    render() {
        let currentSocket = this.props.currentSocket;
        return (
            <div className="d-flex justify-content-center">
                <textarea className="col-md-6 pt-2" onKeyPress={this.handleKeyPressed} onChange={this.handleChange}
                          value={this.state.textareaVal} disabled={currentSocket? currentSocket.disconnected: false}/>
                <button className="col-md-1" onClick={this.handleClick}>Отправить</button>
            </div>
        );
    }
}

export default ChatInput;