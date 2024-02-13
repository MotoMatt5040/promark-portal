import React, {useEffect, useState} from 'react';
import axios from "../../api/axios";
import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ToggleButton from '@mui/material/ToggleButton';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';

export default function PeriodicUpdate() {
  // const [show, setShow] = useState(false);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState({});
  const [locationID, setLocationID] = useState('');
  const [projectID, setProjectID] = useState("");
  const [projectIDs, setProjectIDs] = useState([]);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMesssage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [tableButton, setTableButton] = useState(<VisibilityIcon/>)
  const [selected, setSelected] = React.useState(false);

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
    setTableButton(() => {if(!isOpen) return <VisibilityIcon/>; else return <VisibilityOffIcon/>;})
  }

  const handleLocationSelect = (event: SelectChangeEvent) => {
    if (event.target.value !== "All") {
      setLocation(event.target.value);
      setLocationID(locations[event.target.value]);
      return
    }
    setLocation('All')
    setLocationID('All')
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

  const handleProjectIDSelect = (event: SelectChangeEvent) => {
    setProjectID(event.target.value);
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
      console.log("info => ", locationID, projectID)
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

      console.log(JSON.stringify(response));

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
        <Box sx={{minWidth: 120}}>
          <FormControl fullWidth>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label="Location"
              onChange={handleLocationSelect}
            >
              <MenuItem value={'All'} >All</MenuItem>
                {Object.keys(locations).map((loc, index) => (
                  <MenuItem key={index} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{minWidth: 120}}>
          <FormControl fullWidth>
            <InputLabel id="project-label">Project</InputLabel>
            <Select
              labelId="project-label"
              id="project"
              value={projectID}
              label="Project"
              onChange={handleProjectIDSelect}
            >
              <MenuItem value={'All'}>All</MenuItem>
                {projectIDs.map((proj, index) => (
                  <MenuItem key={index} value={proj}>
                    {proj}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <br/>
      <div style={{display: 'flex', width: "100%", justifyContent: 'right'}}>
        {/*<Button onClick={toggle} >{tableButton}</Button>*/}
        {/*style={{backgroundColor: 'grey', border: 'darkgrey'}}*/}
        <ToggleButton
          value="check"
          selected={selected}
          onChange={() => {setSelected(!selected); toggle();}}
        >
          {tableButton}
        </ToggleButton>
      </div>
      {
        isOpen
        &&
        <Table>
          <thead>
            <tr>
              {projectID === 'All' && <th>Project ID</th>}
              {location === 'All' && <th>Location</th>}
              <th>EID</th>
              <th>Name</th>
              <th>Tenure</th>
              <th>HRS</th>
              <th>CMS</th>
              <th>IntAL</th>
              <th>CPH</th>
              <th>MPH</th>
              <th>Pause Time</th>
              <th>Connect Time</th>
              <th>Total Dials</th>
              <th>NAAM</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {projectID === 'All' && <td>{item.projectid}</td>}
                {location === 'All' && <td>{item.RecLoc}</td>}
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
