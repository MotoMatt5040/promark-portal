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
  const [errorMessage, setErrorMesssage] = useState('');

  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState({});
  const [locationID, setLocationID] = useState('');

  const [projectID, setProjectID] = useState("");
  const [projectIDs, setProjectIDs] = useState([]);

  const [periodicUpdateData, setPeriodicUpdateData] = useState([]);
  const [periodicUpdateIsOpen, setPeriodicUpdateIsOpen] = useState(true);
  const [periodicUpdateTableButton, setPeriodicUpdateTableButton] = useState(<VisibilityIcon/>)
  const [periodicUpdateSelected, setPeriodicUpdateSelected] = React.useState(false);

  const [productionSummaryData, setProductionSummaryData] = useState({});
  const [productionSummaryIsOpen, setProductionSummaryIsOpen] = useState(true)
  const [productionSummaryTableButton, setProductionSummaryTableButton] = useState(<VisibilityIcon/>)
  const [productionSummarySelected, setProductionSummarySelected] = React.useState(false);

  useEffect(() => {
    handleLocationOptions();
    handleProjectIDOptions();
    handleProductionSummaryTableUpdate();
  }, []); // Fetch locations on component mount

  useEffect(() => {
    handlePeriodicUpdateTable().then(() => {console.log("Updated")})
  }, [ locationID, projectID ])

  const togglePeriodicUpdate = () => {
    setPeriodicUpdateIsOpen((periodicUpdateIsOpen) => !periodicUpdateIsOpen)
    setPeriodicUpdateTableButton(() => {if(!periodicUpdateIsOpen) return <VisibilityIcon/>; else return <VisibilityOffIcon/>;})
  }

  const toggleProductionSummary = () => {
    setProductionSummaryIsOpen((productionSummaryIsOpen) => !productionSummaryIsOpen)
    setProductionSummaryTableButton(() => {if(!productionSummaryIsOpen) return <VisibilityIcon/>; else return <VisibilityOffIcon/>;})
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

  const handleProductionSummaryTableUpdate = () => {
    axios.get('/project_summary', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      // const projectIDs = Object.values(projectData.projectid);
      setProductionSummaryData(response.data);
      // console.log(productionSummaryData);
      // console.log(productionSummaryData)
    })
    .catch((error) => {
      console.error("Error fetching project ID's:", error);
    });
  }

  const handlePeriodicUpdateTable = async () => {
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

      setPeriodicUpdateData(response.data);

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
         <ToggleButton
          value="check"
          selected={productionSummarySelected}
          onChange={() => {setProductionSummarySelected(!productionSummarySelected); toggleProductionSummary();}}
        >
          {productionSummaryTableButton}
        </ToggleButton>
      </div>
      {
        productionSummaryIsOpen
        &&
        Object.keys(productionSummaryData).length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Center</th>
                <th>CMS</th>
                <th>HRS</th>
                <th>CPH</th>
                <th>MPH</th>
                <th>AL</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(productionSummaryData.ProjectID).map((index) => (
                <tr key={index}>
                  <td>{productionSummaryData.ProjectID[index]}</td>
                  <td>{productionSummaryData.ProjName[index]}</td>
                  <td>{productionSummaryData.LongName[index]}</td>
                  <td>{productionSummaryData.CMS[index]}</td>
                  <td>{productionSummaryData.HRS[index]}</td>
                  <td>{productionSummaryData.CPH[index]}</td>
                  <td>{productionSummaryData.MPH[index]}</td>
                  <td>{productionSummaryData.AL[index]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Loading...</p>
        )
      }
      <div style={{display: 'flex', width: "100%", justifyContent: 'right'}}>
        {/*<Button onClick={toggle} >{tableButton}</Button>*/}
        {/*style={{backgroundColor: 'grey', border: 'darkgrey'}}*/}
        <ToggleButton
          value="check"
          selected={periodicUpdateSelected}
          onChange={() => {setPeriodicUpdateSelected(!periodicUpdateSelected); togglePeriodicUpdate();}}
        >
          {periodicUpdateTableButton}
        </ToggleButton>
      </div>
      {
        periodicUpdateIsOpen
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
            {periodicUpdateData.map((item, index) => (
              <tr key={index}>
                {projectID === 'All' && <td>{item.projectid}</td>}
                {location === 'All' && <td>{item.LongName}</td>}
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
