import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import Dropdown from "react-bootstrap/Dropdown";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function PeriodicUpdate() {
  // const [show, setShow] = useState(false);
  const [location, setLocation] = useState("Location");
  const [locations, setLocations] = useState({});
  const [locationID, setLocationID] = useState('Location ID');
  const [projectID, setProjectID] = useState("Project ID");
  const [projectIDs, setProjectIDs] = useState([]);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMesssage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tableButton, setTableButton] = useState("<")

  useEffect(() => {
    handleLocationOptions();
  }, []); // Fetch locations on component mount

  useEffect(() => {
    handleProjectIDOptions();
  }, []); // Fetch project IDs on component mount

  useEffect(() => {
    if (locationID !== "Location ID" && projectID !== "Project ID") {
      handleUpdateTable().then(() => {console.log("Updated")})

    }
  }, [ locationID, projectID ])

  const toggle = () => {
    setIsOpen((isOpen) => !isOpen)
    setTableButton(() => {if(!isOpen) return '>'; else return "<";})
  }

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationID(locations[selectedLocation]);
  }

  const handleLocationOptions = () => {
    axios.get('/active/locations', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      setLocations(response.data);
    })
    .catch((error) => {
      console.error('Error fetching locations:', error);
    });
  };

  const handleProjectIDSelect = (selectedProject) => {
    setProjectID(selectedProject);
  }

  const handleProjectIDOptions = () => {
    axios.get('/active/projects', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      const projectData = response.data; // Get the JSON data
      const projectIDs = Object.values(projectData.projectid);
      setProjectIDs(projectIDs); // Set project ID's in state
    })
    .catch((error) => {
      console.error("Error fetching project ID's:", error);
    });
  }

  const handleUpdateTable = async () => {
    try {
      let config = {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      const response = await axios.post(
        "/periodic_update",
        { locationID, projectID },
        config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for periodic update')
      }

      setData(response.data);

      // console.log(JSON.stringify(response));

    } catch (error) {
      if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Login Failed')
      }
      console.log(errorMessage)
    }
  }

  return (
    <div className="container" id="production-report-container">
      <br/>
      <div className="dropdowns" id="dropdowns" style={dropdownStyle}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="location-dropdown">{location}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleLocationSelect("Location")}>All</Dropdown.Item>
            {Object.keys(locations).map((loc, index) => (
              <Dropdown.Item key={index} onClick={() => handleLocationSelect(loc)}>
                {loc}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="projectid-dropdown">{projectID}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleProjectIDSelect("Project ID")}>All</Dropdown.Item>
            {projectIDs.map((proj, index) => (
              <Dropdown.Item key={index} onClick={() => handleProjectIDSelect(proj)}>
                {proj}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <br/>
      <div style={{display: 'flex', width: "100%", justifyContent: 'right'}}>
        <Button onClick={toggle}>{tableButton}</Button>
      </div>
      {
        isOpen
        &&
        <Table>
          <thead>
            <tr>
              <th>RecLoc</th>
              <th>EID</th>
              <th>MyName</th>
              <th>Tenure</th>
              <th>HRS</th>
              <th>CMS</th>
              <th>IntAL</th>
              <th>CPH</th>
              <th>MPH</th>
              <th>PauseTime</th>
              <th>ConnectTime</th>
              <th>TotalDials</th>
              <th>NAAM</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.RecLoc}</td>
                <td>{item.EID}</td>
                <td><a href="#">{item.MyName}</a></td>
                <td>{item.Tenure}</td>
                <td>{item.HRS}</td>
                <td>{item.CMS}</td>
                <td>{item.IntAL}</td>
                <td>{item.CPH}</td>
                <td>{item.MPH}</td>
                <td>{item.PauseTime}</td>
                <td>{item.ConnectTime}</td>
                <td>{item.TotalDials}</td>
                <td>{item.NAAM}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
    </div>
  )
}

// const containerStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'space-evenly',
//   alignContent: 'center',
//   width: '100%'
// }

const dropdownStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}
//
// const dateButtonStyle = {
//   backgroundColor: 'green !important'
// }
//
// const dateCanvasStyle = {
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-evenly',
//   alignContent: 'center',
//   width: '100%'
// }
