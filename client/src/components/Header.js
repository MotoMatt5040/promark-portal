import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = (props) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home">Promark Research</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://dashapp.promarkresearch.com/">Dashboard</Nav.Link>
            <NavDropdown title="Production Dashboard" id="dash">
              <NavDropdown.Item href="/production_report">Production Report</NavDropdown.Item>
              <NavDropdown.Item href="/periodic_update">Periodic Update</NavDropdown.Item>
              <NavDropdown.Item href="/interviewer_breakdown">Interviewer Breakdown</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="data_processing">Data Processing</Nav.Link>
            <Nav.Link href="global_quotas">Global Quota Module</Nav.Link>
            <NavDropdown title="Profile" id="profile">
              <NavDropdown.Item href="settings">Settings</NavDropdown.Item>
              <NavDropdown.Item href="https://www.promarkresearch.com/privacy-policy/">Privacy Policy</NavDropdown.Item>
              <div style={{borderBottom: "1px solid lightgrey", margin: "5px"}}></div>
              <NavDropdown.Item href="logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default Header;
