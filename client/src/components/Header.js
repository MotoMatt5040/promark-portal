import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
const Header = (props) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Promark Research</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#production_report">Production Report</Nav.Link>
            <NavDropdown title="Texting Platform" id="basic-nav-dropdown">
              <NavDropdown.Item href="#texting_platform/sample_upload">Sample Upload</NavDropdown.Item>
              <NavDropdown.Item href="#texting_platform/next_item">Next Item</NavDropdown.Item>
              <NavDropdown.Item href="#texting_platform/potential_third_item">Potential Third Item</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#texting_platoform/send_message">Send Messages</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default Header;