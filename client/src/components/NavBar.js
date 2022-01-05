import React, { Component } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { navStyles } from '../styles'


const NavBar = (props) => {
        return (
            <div>
                <Navbar bg="dark" variant="dark" expand="lg" >
                    <Container>
                        <Navbar.Brand as={Link} to="/">IDIM</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        {props.token?
                        <h6 style={navStyles.points}>{props.totalPoints} points</h6>
                        :''}
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" >
                        {props.token ?
                            <>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/mytasks">My Tasks</Nav.Link>
                            <Nav.Link as={Link} to="/taskbuilder">Task Builder</Nav.Link>
                            <Nav.Link as={Link} to="/info">Info</Nav.Link>
                            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                            </>
                            :
                            <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        }
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    
}

export default NavBar;
