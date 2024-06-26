import axios from "../../api/axios";
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { Calendar } from 'react-date-range';

function ProductionReport() {

  const [show, setShow] = useState(false);
  const [location, setLocation] = useState("Location");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  }

  const getLocations = () => {
    axios.get('/', {
      responseType: 'application/json',
      headers: {
        'Content-Type': 'application/json',
          'X-Csrftoken': localStorage.getItem('csrftoken')
      }
    })
      .then((obj) => {
        console.log(obj.data);
      })
      .catch(error => console.error(error))
  };

  const handleDateSelect = (date) => {
    console.log(date); // native Date object
  }

  return (
    <div className="container" id="production-report-container" style={containerStyle}>
      <div className="dropdowns" id="dropdowns" style={dropdownStyle}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="location-dropdown">
            {location}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleLocationSelect("Location")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLocationSelect("Location 1")}>Location 1</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLocationSelect("Location 2")}>Location 2</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLocationSelect("Location 3")}>Location 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="interviewers">Interviewers</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Name 1</Dropdown.Item>
            <Dropdown.Item>Name 2</Dropdown.Item>
            <Dropdown.Item>Name 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="primary" onClick={handleShow} className="me-2">Date</Button>
        <Offcanvas show={show} onHide={handleClose} placement={'top'} style={{maxWidth: "30%"}}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body  style={dateCanvasStyle}>
            <DateRange
              editableDateInputs={true}
              onChange={item => setState([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={state}
            />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <br/>
      <Table>
        <thead>
        <tr>
          <th>COL 1</th>
          <th>COL 2</th>
          <th>COL 3</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>dat 1</td>
            <td>dat 2</td>
            <td>dat 3</td>
          </tr>
        <tr>
            <td>dat 4</td>
            <td>dat 5</td>
            <td>dat 6</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default ProductionReport;

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}

const dropdownStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}

const dateButtonStyle = {
  backgroundColor: 'green !important'
}

const dateCanvasStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}
