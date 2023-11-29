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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  const getLocations = () => {
    axios.get('/', {
      responseType: 'application/json',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((obj) => {
        console.log(obj.data);
      })
      .catch(error => console.error(error))
  };

  const handleSelect = (date) => {
    console.log(date); // native Date object
  }

  return (
    <div className="container" id="production-report-container" style={containerStyle}>
      <div className="dropdowns" id="dropdowns" style={dropdownStyle}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="location-dropdown">
            Location
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Location 1</Dropdown.Item>
            <Dropdown.Item>Location 2</Dropdown.Item>
            <Dropdown.Item>Location 3</Dropdown.Item>
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
        {/*<DateRangePicker style={dateButtonStyle} initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014' }}>*/}
        {/*  <button>Date Range</button>*/}
        {/*</DateRangePicker>*/}
        {/*<DateRangePicker ranges={['startDate': new Date()]} onChange={handleSelect} />*/}
        <Button variant="primary" onClick={handleShow} className="me-2">Date</Button>
        <Offcanvas show={show} onHide={handleClose} placement={'top'}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
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
