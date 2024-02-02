import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export default function PeriodicUpdate() {
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState("Location");
  const [locations, setLocations] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleLocationOptions();
  }, []); // Fetch locations on component mount

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  }

  const handleLocationOptions = () => {
    axios.get('/active/locations', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      const locationsData = response.data; // Get the JSON data
      const longNames = Object.values(locationsData.LongName); // Extract the values associated with "LongName"
      setLocations(longNames); // Set locations in state
    })
    .catch((error) => {
      console.error('Error fetching locations:', error);
    });
  };

  const handleDateSelect = (date) => {
    console.log(date); // native Date object
  }

  return (
    <div className="container" id="production-report-container">
      <div className="dropdowns" id="dropdowns">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="location-dropdown">
            {location}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleLocationSelect("Location")}>All</Dropdown.Item>
            {locations.map((loc, index) => (
              <Dropdown.Item key={index} onClick={() => handleLocationSelect(loc)}>
                {loc}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {/* Other dropdowns */}
      </div>
      <br/>
      <div>
        <Button onClick={handleLocationOptions}>Test</Button>
      </div>
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
