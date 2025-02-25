import React, {useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from 'react-bootstrap/Table';
import './styles.css';
import Cookies from "js-cookie";
import * as XLSX from 'xlsx';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': Cookies.get("csrf_token")
  }
};

function Quotas() {

  const [comSurveyID, setComSurveyID] = useState();
  const [webSurveyID, setWebSurveyID] = useState();
  const [landlineSurveyID, setLandlineSurveyID] = useState();
  const [cellSurveyID, setCellSurveyID] = useState();

  const [comSurveyName, setComSurveyName] = useState('COM Survey ID');
  const [webSurveyName, setWebSurveyName] = useState('Web Survey ID');
  const [landlineSurveyName, setLandlineSurveyName] = useState('Landline Survey ID');
  const [cellSurveyName, setCellSurveyName] = useState('Cell Survey ID');

  const [isComSurveyIDError, setComSurveyIDError] = useState(false);
  const [isWebSurveyIDError, setWebSurveyIDError] = useState(false);
  const [isLandlineSurveyIDError, setLandlineSurveyIDError] = useState(false);
  const [isCellSurveyIDError, setCellSurveyIDError] = useState(false);

  const [comData, setComData] = useState({});
  const [webData, setWebData] = useState({});
  const [landlineData, setLandlineData] = useState({});
  const [cellData, setCellData] = useState({});
  const [data, setData] = useState({});

  const [showColumns, setShowColumns] = useState({
    web: true,
    phone: true,
    panel: true,
    t2w: true,
    landline: true,
    cell: true
  });

  const toggleColumn = (column) => {
    setShowColumns({
      ...showColumns,
      [column]: !showColumns[column]
    });
  };

  useEffect(() => {
    // const com = localStorage.getItem('comSurveyID')
    // const web = localStorage.getItem('webSurveyID')
    // const ll = localStorage.getItem('landlineSurveyID')
    // const cell = localStorage.getItem('cellSurveyID')
    // setComSurveyID(com)
    // setWebSurveyID(web)
    // setLandlineSurveyID(ll)
    // setCellSurveyID(cell)
    // getSurveyName('COM', com)
    // getSurveyName('Web', web)
    // getSurveyName('LL', ll)
    // getSurveyName('Cell', cell)
  }, []);

  const handleRun = async () => {
    setComData({});
    setWebData({});
    setLandlineData({});
    setCellData({});
    if(!isComSurveyIDError) {
      await getSurveyQuotas('COM', comSurveyID);
    }
    if(!isWebSurveyIDError) {
      await getSurveyQuotas('Web', webSurveyID);
    }
    if(!isLandlineSurveyIDError) {
      await getSurveyQuotas('LL', landlineSurveyID);
    }
    if(!isCellSurveyIDError) {
      await getSurveyQuotas('Cell', cellSurveyID);
    }
    await axios.get(
      "/quotas/merge",
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': localStorage.getItem('csrftoken')
        }
      })
      .then((response) => {
        console.log(response.data)
        setData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching merged data:', error);
      })
        .finally(() => {console.log("DATA HERE"); console.log(data)});
  };

  const checkData = () => {
    console.log(webData, landlineData, cellData);
    axios.get("/quotas/check", {headers: {'X-Csrftoken': localStorage.getItem('csrftoken')}})
  }

  const handleSurveyIDChange = (e) => {
    const value = e.target.value;
    const source_id = e.target.id;

    switch (source_id) {
      case "COM":
        setComSurveyID(value);
        setComSurveyIDError(value.length <5);
        if(value.length > 4) {
          localStorage.setItem("comSurveyID", value)
          getSurveyName(source_id, value);
        }
        break;
      case "Web":
        setWebSurveyID(value);
        setWebSurveyIDError(value.length < 3);
        if(value.length > 2) {
          localStorage.setItem("webSurveyID", value)
          getSurveyName(source_id, value);
        }
        break;
      case "LL":
        setLandlineSurveyID(value);
        setLandlineSurveyIDError(value.length < 5);
        if(value.length > 4) {
          localStorage.setItem("landlineSurveyID", value)
          getSurveyName(source_id, value);
        }
        break;
      case "Cell":
        setCellSurveyID(value);
        setCellSurveyIDError(value.length < 5);
        if(value.length > 4) {
          localStorage.setItem("cellSurveyID", value)
          getSurveyName(source_id, value);
        }
        break;
      default:
        break;
    }
  }

  const getSurveyName = async (source, surveyID) => {
    console.log(source, surveyID)
    axios.post(
      '/quotas/survey_name',
      { source, surveyID },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': localStorage.getItem('csrftoken')
        }
    })
      .then((response) => {
        switch (source) {
          case 'COM':
            setComSurveyName(response.data);
            break;
          case 'Web':
            setWebSurveyName(response.data);
            break;
          case 'LL':
            setLandlineSurveyName(response.data);
            break;
          case 'Cell':
            setCellSurveyName(response.data);
            break;
          default:
            return '';
        }
      })
      .catch((error) => {
        console.error("Error fetching survey name", error)
        switch (source) {
          case 'COM':
            setComSurveyName("Invalid COM Survey ID");
            setComSurveyIDError(true)
            break;
          case 'Web':
            setWebSurveyName("Invalid Web Survey ID");
            setWebSurveyIDError(true)
            break;
          case 'LL':
            setLandlineSurveyName("Invalid Landline Survey ID");
            setLandlineSurveyIDError(true)
            break;
          case 'Cell':
            setCellSurveyName("Invalid Cell Survey ID");
            setCellSurveyIDError(true)
            break;
          default:
            return '';
        }
      })
  }

  const getSurveyQuotas = async (source, surveyID) => {
    await axios.post(
      '/quotas/survey_quotas',
      { source, surveyID },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': localStorage.getItem('csrftoken')
        }
    })
      .then((response) => {
        switch (source) {
          case 'COM':
            setComData({});
            setComData(response.data);
            console.log(response.data);
            break;
          case 'Web':
            setWebData({});
            setWebData(response.data);
            break;
          case 'LL':
            setLandlineData({});
            setLandlineData(response.data);
            break;
          case 'Cell':
            setCellData({});
            setCellData(response.data);
            break;
          default:
            return '';
        }
      })
      .catch((error) => {
        console.error("Error fetching survey quotas", error)
      })
  }

  const handleErrors = (error) => {
    if (!error?.response) {
      console.error('No Server Response');
    } else if (error.response.status === 401) {
      console.error('Invalid Credentials');
    } else {
      console.error('Request Failed');
    }
  };

  const downloadExcel = () => {
    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Headers
    let header1 = ["Criterion", "Label", "Obj", "Freq", "ToDo", "DONE%"];
    if (showColumns.web) {
      header1.push("Web Total%");
      if (showColumns.panel) {
        header1.push("Panel Objective");
        header1.push("Panel Frequency");
        header1.push("Panel%");
      }
      if (showColumns.t2w){
        header1.push("T2W Objective");
        header1.push("T2W Frequency");
        header1.push("T2W%");
      }
    }
    if (showColumns.phone) {
      header1.push("Phone Total %");
      if (showColumns.landline){
        header1.push("Landline Objective");
        header1.push("Landline Frequency");
        header1.push("Landline%");
      if (showColumns.cell) {
        header1.push("Cell Objective");
        header1.push("Cell Frequency");
        header1.push("Cell%");}
      }
    }

    // Add headers to the worksheet
    XLSX.utils.sheet_add_aoa(ws, [header1], { origin: "A1" });

    // Add data to the worksheet
    Object.keys(data.Criterion).forEach((key, index) => {
      let row = [
        data.Criterion[index],
        data['COM Label'][index],
        data['COM Objective'][index],
        data['COM Frequency'][index],
        data['COM To Do'][index],
        data['G%'][index] + "%"
      ];

      if (showColumns.web) {
        row.push(data['W%'][index] + "%");
        if (showColumns.panel) {
          row.push(data['Panel Objective'][index]);
          row.push(data['Panel Frequency'][index]);
          row.push(data['P%'][index] + "%");
        }
        if (showColumns.t2w) {
          row.push(data['T2W Objective'][index]);
          row.push(data['T2W Frequency'][index]);
          row.push(data['T%'][index] + "%");
        }
      }
      if (showColumns.phone) {
        row.push(data['Phone%'][index] + "%");
        if (showColumns.landline) {
          row.push(data['LL Objective'][index]);
          row.push(data['LL Frequency'][index]);
          row.push(data['L%'][index] + "%");
        }
        if (showColumns.cell) {
          row.push(data['Cell Objective'][index]);
          row.push(data['Cell Frequency'][index]);
          row.push(data['C%'][index] + "%");
        }
      }

      XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
    });

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");

    // Generate and download the Excel file
    const survey_n = comSurveyName.split(' ')[0];
    XLSX.writeFile(wb, `${survey_n} Quotas.xlsx`);
  };

  // functionality for a search bar for criteria for data filtering

  return (
      <div>
        <div className='p-4 text-center bg-light' style={headerStyle}>
          <div className='dp-form' style={formDiv}>
            <div style={formStyle}>
              <Form.Group className="mb-3" controlId="formGroupSruveryId">
                <Box
                    component="form"
                    sx={{
                      '& > :not(style)': {m: 1, width: '25ch'},
                    }}
                    noValidate
                    autoComplete="off"
                >
                  <TextField
                      id="COM"
                      error={isComSurveyIDError}
                      autoComplete="off"
                      onChange={handleSurveyIDChange}
                      value={comSurveyID}
                      label={comSurveyName}
                      required
                      variant="standard"
                  />
                </Box>
              </Form.Group>
              <div style={formTextBox}>
                <Form.Group className="mb-3" controlId="formGroupSruveryId">
                  <Box
                      component="form"
                      sx={{
                        '& > :not(style)': {m: 1, width: '25ch'},
                      }}
                      noValidate
                      autoComplete="off"
                  >
                    <TextField
                        id="Web"
                        error={isWebSurveyIDError}
                        autoComplete="off"
                        onChange={handleSurveyIDChange}
                        value={webSurveyID}
                        label={webSurveyName}
                        required
                        variant="standard"
                    />
                  </Box>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupSruveryId">
                  <Box
                      component="form"
                      sx={{
                        '& > :not(style)': {m: 1, width: '25ch'},
                      }}
                      noValidate
                      autoComplete="off"
                  >
                    <TextField
                        id="LL"
                        error={isLandlineSurveyIDError}
                        autoComplete="off"
                        onChange={handleSurveyIDChange}
                        value={landlineSurveyID}
                        label={landlineSurveyName}
                        required
                        variant="standard"
                    />
                  </Box>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupSruveryId">
                  <Box
                      component="form"
                      sx={{
                        '& > :not(style)': {m: 1, width: '25ch'},
                      }}
                      noValidate
                      autoComplete="off"
                  >
                    <TextField
                        id="Cell"
                        error={isCellSurveyIDError}
                        autoComplete="off"
                        onChange={handleSurveyIDChange}
                        value={cellSurveyID}
                        label={cellSurveyName}
                        required
                        variant="standard"
                    />
                  </Box>
                </Form.Group>
              </div>
            </div>
          </div>
          <Button onClick={handleRun}>Run</Button>
          <Button onClick={checkData}>Check Data</Button>
        </div>
        {/*{typeof webData !== {}*/}
        <div style={{display: 'flex', width: "100%", alignItems: "center", justifyContent: "center"}}>
          <Table style={{width: "10%", border: '1px solid black'}} striped>
            <thead>
            <tr>
              <th scope='col' colSpan='7'
                  style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Legend
              </th>
            </tr>
            </thead>
            <tbody>
            <tr style={{border: '1px solid black'}}>
              <td style={{backgroundColor: "#43B17B", color: "white", border: '1px solid black'}}>Open</td>
              <td style={{backgroundColor: "#ED211C", color: "white", border: '1px solid black'}}>Closed</td>
              <td style={{color: "crimson", border: '1px solid black'}}>+2% below</td>
              <td style={{color: "darkorange", border: '1px solid black'}}>~2% below</td>
              <td style={{backgroundColor: "lightgreen", border: '1px solid black'}}>Within 1%</td>
              <td style={{backgroundColor: "lightyellow", border: '1px solid black', color: 'darkorange'}}>~2% above
              </td>
              <td style={{backgroundColor: "lightpink", border: '1px solid black', color: 'crimson'}}>+2% above</td>
            </tr>
            </tbody>
          </Table>
        </div>
        <div className='checkbox-container' style={{ position: 'sticky', top: '0', zIndex: 10 }}>
          <label>Show/Hide Columns:</label>
          <Button onClick={downloadExcel}>Download Excel</Button>
        </div>
        <label>Show/Hide Columns:</label>
          <div>
            <input type="checkbox" checked={showColumns.web} onChange={() => toggleColumn('web')}/> Web
          </div>
          <div style={{paddingLeft: '1%'}}>
            <input type="checkbox" checked={showColumns.panel} onChange={() => toggleColumn('panel')}/> Panel
          </div>
          <div style={{paddingLeft: '1%'}}>
            <input type="checkbox" checked={showColumns.t2w} onChange={() => toggleColumn('t2w')}/> T2W
          </div>
          <div>
            <input type="checkbox" checked={showColumns.phone} onChange={() => toggleColumn('phone')}/> Phone
          </div>
          <div style={{paddingLeft: '1%'}}>
            <input type="checkbox" checked={showColumns.landline} onChange={() => toggleColumn('landline')}/> Landline
          </div>
          <div style={{paddingLeft: '1%'}}>
            <input type="checkbox" checked={showColumns.cell} onChange={() => toggleColumn('cell')}/> Cell
          </div>
        </div>
        <div style={{display: 'flex', width: "100%", alignItems: "center", justifyContent: "center"}}>
          {Object.keys(data).length > 0 && (
              <Table style={{width: "50%", border: '1px solid black'}} striped>
                <thead>
                <tr>
                  <th scope="col" colSpan="5"
                      style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}></th>
                  {showColumns.web && <th scope="col"
                                          colSpan={showColumns.panel && showColumns.t2w ? "8" : (!showColumns.panel && !showColumns.t2w ? "2" : "5")}
                                          style={{
                                            border: '1px solid black',
                                            background: "lightgrey",
                                            textAlign: "center"
                                          }}>Web</th>}
                  {showColumns.phone && <th scope="col"
                                            colSpan={showColumns.landline && showColumns.cell ? "8" : (!showColumns.landline && !showColumns.cell ? "2" : "5")}
                                            style={{
                                              border: '1px solid black',
                                              background: "lightgrey",
                                              textAlign: "center"
                                            }}>Phone</th>}
                </tr>
                <tr>
                  <th scope="col" colSpan="5"
                      style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Global
                  </th>
                  {showColumns.web && <>
                    <th scope="col" colSpan="2"
                        style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Total
                    </th>
                    {showColumns.panel && <th scope="col" colSpan="3" style={{
                      border: '1px solid black',
                      background: "lightgrey",
                      textAlign: "center"
                    }}>Panel</th>}
                    {showColumns.t2w && <th scope="col" colSpan="3" style={{
                      border: '1px solid black',
                      background: "lightgrey",
                      textAlign: "center"
                    }}>T2W</th>}
                  </>}
                  {showColumns.phone && <>
                    <th scope="col" colSpan="2"
                        style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Total
                    </th>
                    {showColumns.landline && <th scope="col" colSpan="3" style={{
                      border: '1px solid black',
                      background: "lightgrey",
                      textAlign: "center"
                    }}>Landline</th>}
                    {showColumns.cell && <th scope="col" colSpan="3" style={{
                      border: '1px solid black',
                      background: "lightgrey",
                      textAlign: "center"
                    }}>Cell</th>}
                  </>}
                </tr>

                <tr>
                  <th style={{border: '1px solid black'}}>Criterion</th>
                  <th style={{border: '1px solid black'}}>Label</th>
                  <th style={{border: '1px solid black'}}>Obj</th>
                  <th style={{border: '1px solid black'}}>Freq</th>
                  <th style={{border: '1px solid black'}}>ToDo</th>

                  {showColumns.web && <>
                    <th style={{border: '1px solid black'}}>%</th>
                    <th style={{border: '1px solid black'}}>Freq</th>
                    {showColumns.panel && <>
                      <th style={{border: '1px solid black'}}>Obj</th>
                      <th style={{border: '1px solid black'}}>Freq</th>
                      <th style={{border: '1px solid black'}}>%</th>
                    </>}
                    {showColumns.t2w && <>
                      <th style={{border: '1px solid black'}}>Obj</th>
                      <th style={{border: '1px solid black'}}>Freq</th>
                      <th style={{border: '1px solid black'}}>%</th>
                    </>}
                  </>}
                  {showColumns.phone && <>
                    <th style={{border: '1px solid black'}}>%</th>
                    <th style={{border: '1px solid black'}}>Freq</th>
                    {showColumns.landline && <>
                      <th style={{border: '1px solid black'}}>Obj</th>
                      <th style={{border: '1px solid black'}}>Freq</th>
                      <th style={{border: '1px solid black'}}>%</th>
                    </>}
                    {showColumns.cell && <>
                      <th style={{border: '1px solid black'}}>Obj</th>
                      <th style={{border: '1px solid black'}}>Freq</th>
                      <th style={{border: '1px solid black'}}>%</th>
                    </>}
                  </>}
                </tr>
                </thead>
                <tbody>
                {Object.keys(data.Criterion).map((key, index) => (

                    <tr key={index}>
                      <td style={{borderLeft: "1px solid black"}}>{data.Criterion[index]}</td>
                      <td style={{borerLeft: "1px solid black"}}>{data['COM Label'][index]}</td>
                      <td>{data['COM Objective'][index]}</td>
                      <td>{data['COM Frequency'][index]}</td>
                      <td style={{borderRight: "1px solid black"}}>{data['COM To Do'][index]}</td>
                      {/*<td style={{borerLeft: "1px solid black"}}>{data['Web Label'][index]}</td>*/}

                      {showColumns.web && <>
                        <td style={{borderRight: "1px solid black"}}>{data['W%'][index]}%</td>
                        <td style={{borderRight: "1px solid black"}}>{data['Web Frequency'][index]}</td>
                        {/*PANEL*/}
                        {showColumns.panel && <>
                          <td style={{
                            backgroundColor: (data['Panel Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                            color: "white"
                          }}
                          >
                            {data['Panel Objective'][index]}
                          </td>
                          <td
                              style={{
                                color:
                                    (-1 <= data["Panel Frequency"][index] - data["Panel Objective"][index] && 1 >= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "" :
                                        (-10 <= data["Panel Frequency"][index] - data["Panel Objective"][index] && 10 >= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "darkorange" :
                                            "crimson",
                                backgroundColor:
                                    (-1 > data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "" :
                                        (-1 <= data["Panel Frequency"][index] - data["Panel Objective"][index] && 1 >= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "lightgreen" :
                                            (10 >= data["Panel Frequency"][index] - data["Panel Objective"][index] && 2 <= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "lightyellow" :
                                                "lightpink"
                              }}>
                            {data['Panel Frequency'][index]}
                          </td>
                          <td style={{borderRight: "1px solid black"}}>{data['P%'][index]}%</td>
                          {/*END PANEL*/}
                        </>}

                        {showColumns.t2w && <>
                          {/*T2W*/}
                          <td style={{
                            backgroundColor: (data['T2W Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                            color: "white"
                          }}
                          >
                            {data['T2W Objective'][index]}
                          </td>
                          <td
                              style={{
                                color:
                                    (-1 <= data["T2W Frequency"][index] - data["T2W Objective"][index] && 1 >= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "" :
                                        (-10 <= data["T2W Frequency"][index] - data["T2W Objective"][index] && 10 >= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "darkorange" :
                                            "crimson",
                                backgroundColor:
                                    (-1 > data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "" :
                                        (-1 <= data["T2W Frequency"][index] - data["T2W Objective"][index] && 1 >= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "lightgreen" :
                                            (10 >= data["T2W Frequency"][index] - data["T2W Objective"][index] && 2 <= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "lightyellow" :
                                                "lightpink"
                              }}>
                            {data['T2W Frequency'][index]}
                          </td>
                          <td style={{borderRight: "1px solid black"}}>{data['T%'][index]}%</td>
                          {/*END T2W*/}
                        </>}
                      </>}

                      {showColumns.phone && <>
                        {/*PHONE*/}
                        <td style={{borderRight: "1px solid black"}}>{data['Phone%'][index]}%</td>
                        <td style={{borderRight: "1px solid black"}}>{data['Phone Frequency'][index]}</td>
                        {showColumns.landline && <>
                          {/*LANDLINE*/}
                          <td style={{
                            backgroundColor: (data['LL Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                            color: "white"
                          }}
                          >
                            {data['LL Objective'][index]}
                          </td>
                          <td
                              style={{
                                color:
                                    (-1 <= data["LL Frequency"][index] - data["LL Objective"][index] && 1 >= data["LL Frequency"][index] - data["LL Objective"][index]) ? "" :
                                        (-10 <= data["LL Frequency"][index] - data["LL Objective"][index] && 10 >= data["LL Frequency"][index] - data["LL Objective"][index]) ? "darkorange" : "crimson",
                                backgroundColor:
                                    (-1 > data["LL Frequency"][index] - data["LL Objective"][index]) ? "" :
                                        (-1 <= data["LL Frequency"][index] - data["LL Objective"][index] && 1 >= data["LL Frequency"][index] - data["LL Objective"][index]) ? "lightgreen" :
                                            (10 >= data["LL Frequency"][index] - data["LL Objective"][index] && 2 <= data["LL Frequency"][index] - data["LL Objective"][index]) ? "lightyellow" : "lightpink"
                              }}>
                            {data['LL Frequency'][index]}
                          </td>
                          <td style={{borderRight: "1px solid black"}}>{data['L%'][index]}%</td>
                          {/*END LANDLINE*/}
                        </>}
                        {showColumns.cell && <>
                          {/*CELL*/}
                          <td
                              style={{
                                backgroundColor: (data['Cell Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                                color: 'white'
                              }}
                          >
                            {data['Cell Objective'][index]}
                          </td>
                          <td
                              style={{
                                color:
                                    (-1 <= data["Cell Frequency"][index] - data["Cell Objective"][index] && 1 >= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "" :
                                        (-10 <= data["Cell Frequency"][index] - data["Cell Objective"][index] && 10 >= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "darkorange" : "crimson",
                                backgroundColor:
                                    (-1 > data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "" :
                                        (-1 <= data["Cell Frequency"][index] - data["Cell Objective"][index] && 1 >= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "lightgreen" :
                                            (10 >= data["Cell Frequency"][index] - data["Cell Objective"][index] && 2 <= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "lightyellow" : "lightpink"
                              }}>
                            {data['Cell Frequency'][index]}
                          </td>
                          <td style={{borderRight: "1px solid black"}}>{data['C%'][index]}%</td>
                          {/*END CELL*/}
                        </>}

                        {/*END PHONE*/}
                      </>}

                    </tr>
                  )
                )}
                </tbody>
              </Table>
          )}
        </div>

      </div>
      // </div>
  )
}

export default Quotas;

const headerStyle = {
  // border: '1px solid black green',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const formDiv = {
  // border: '1px solid blue',
  display: 'flex',
  flexDirection: 'row',
  width: "40%",
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const formStyle = {
  // border: '1px solid red',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
}

const formTextBox = {
  // border: '1px solid black green',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
  width: '70%'
}
