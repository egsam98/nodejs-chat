import React from 'react';
import {Modal, ModalBody, ModalHeader, ModalFooter, Button} from 'reactstrap';
import '../css/styles.css';

class Login extends React.Component {

    constructor(props){
        super(props);
        this.inputVal = '';
        this.state = {
            isOpen: true
        };
    }

    componentDidMount() {
        this.refs.input.focus();
    }

    updateInputVal = (event) => {
        this.inputVal = event.target.value;
    };

    handleClick = () => {
        this.props.connectToRoom(this.inputVal);
        this.setState({isOpen: false});
    };

    handleKeyPressed = (event) => {
        if (event.key !== 'Enter') return false;
        this.handleClick();
    };

    render() {
        return (
            <Modal id="login" isOpen={this.state.isOpen} centered={true}>
                <ModalHeader>Введите свой никнейм</ModalHeader>
                <ModalBody className='flex-centered'>
                    <input className='match-parent' onChange={this.updateInputVal}
                           onKeyPress={this.handleKeyPressed} ref="input" />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.handleClick}>ОК</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Login;