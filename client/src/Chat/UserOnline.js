import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Cookies from 'universal-cookie';

class UserOnline extends React.Component{

    constructor(props) {
        super(props);
        this.divRef = React.createRef();
        this.menuRefs = [];
        this.state = {
            toggleMenu: false,
            subDivBackground: 'white',
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick);
        for(let menuRef of this.menuRefs) {
            menuRef.addEventListener('mouseenter', this.handleMouseEnter);
            menuRef.addEventListener('mouseleave', this.handleMouseLeave);
        }
    }

    toggleMenu = () => {
        const cookies = new Cookies();
        if (parseInt(cookies.get('id')) !== this.props.user.id)
            this.setState({toggleMenu: !this.state.toggleMenu});
    };

    handleOutsideClick = (event) => {
        if ((this.divRef.current !== event.target.parentElement)
        && (this.divRef.current !== event.target)){
            this.setState({toggleMenu: false});
        }
    };

    handleMouseEnter = (event) => {
        event.target.style.backgroundColor = 'blue';
    };

    handleMouseLeave = (event) => {
        event.target.style.backgroundColor = 'white';
    };

    setMenuRefs = (elem) => {
        return this.menuRefs.push(elem)
    };

    render() {
        const subDivStyle = {
            cursor: 'pointer',
            backgroundColor: this.state.subDivBackground,
            display: 'flex',
            justifyContent: 'center'
        };
        const divStyle = {
            position: 'absolute',
            display: this.state.toggleMenu ? 'block': 'none',
            border: 'black 1px solid',
            minWidth: '160px',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
            backgroundColor: 'white',
            zIndex: 1
        };
        return (
            <div ref={this.divRef} onClick={this.toggleMenu}>
                <img src={this.props.user.avatar} style={{cursor: 'pointer'}} />{this.props.user.nickname}
                <div style={divStyle}>
                    <Link style={{ textDecoration: 'none' }} to={`#`}
                    onClick={() => this.props.connectToPrivate(this.props.user)}>
                        <div ref={this.setMenuRefs} style={subDivStyle}>
                            Написать в ЛС
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default UserOnline;