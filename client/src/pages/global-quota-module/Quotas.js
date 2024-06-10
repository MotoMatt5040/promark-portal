import React, {useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from 'react-bootstrap/Table';
// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

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
      });
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
          getSurveyName(source_id, value);
        }
        break;
      case "Web":
        setWebSurveyID(value);
        setWebSurveyIDError(value.length < 3);
        if(value.length > 2) {
          getSurveyName(source_id, value);
        }
        break;
      case "LL":
        setLandlineSurveyID(value);
        setLandlineSurveyIDError(value.length < 5);
        if(value.length > 4) {
          getSurveyName(source_id, value);
        }
        break;
      case "Cell":
        setCellSurveyID(value);
        setCellSurveyIDError(value.length < 5);
        if(value.length > 4) {
          getSurveyName(source_id, value);
        }
        break;
      default:
        break;
    }
  }

  const getSurveyName = async (source, surveyID) => {
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

  return (
    <div>
      <div className='p-4 text-center bg-light' style={headerStyle}>
        <div className='dp-form' style={formDiv}>
          <div style={formStyle}>
            <Form.Group className="mb-3" controlId="formGroupSruveryId">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
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
                    '& > :not(style)': { m: 1, width: '25ch' },
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
                    '& > :not(style)': { m: 1, width: '25ch' },
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
                  '& > :not(style)': { m: 1, width: '25ch' },
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
              <th scope='col' colSpan='7' style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Legend</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{border: '1px solid black', textAlign: "center"}}>
              <td style={{backgroundColor: "#43B17B", color: "white", border: '1px solid black'}}>Open</td>
              <td style={{backgroundColor: "#ED211C", color: "white", border: '1px solid black'}}>Closed</td>
              <td style={{color: "crimson", border: '1px solid black'}}>+10 below</td>
              <td style={{color: "darkorange", border: '1px solid black'}}>~10 below</td>
              <td style={{backgroundColor: "lightgreen", border: '1px solid black'}}>Within 1</td>
              <td style={{backgroundColor: "lightyellow", border: '1px solid black', color: 'darkorange'}}>~10 above</td>
              <td style={{backgroundColor: "lightpink", border: '1px solid black', color: 'crimson'}}>+10 above</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div>
        <label>Show/Hide Columns:</label>
        <input type="checkbox" checked={showColumns.web} onChange={() => toggleColumn('web')} /> Web
        <input type="checkbox" checked={showColumns.phone} onChange={() => toggleColumn('phone')} /> Phone
        <input type="checkbox" checked={showColumns.panel} onChange={() => toggleColumn('panel')} /> Panel
        <input type="checkbox" checked={showColumns.t2w} onChange={() => toggleColumn('t2w')} /> T2W
        <input type="checkbox" checked={showColumns.landline} onChange={() => toggleColumn('landline')} /> Landline
        <input type="checkbox" checked={showColumns.cell} onChange={() => toggleColumn('cell')} /> Cell
      </div>
      <div style={{display: 'flex', width: "100%", alignItems: "center", justifyContent: "center"}}>
        {Object.keys(data).length > 0 && (
          <Table style={{width: "50%", border: '1px solid black'}} striped>
            <thead>
              <tr>
                <th scope="col" colSpan="5" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}></th>
                {showColumns.web && <th scope="col" colSpan={showColumns.panel && showColumns.t2w ? "7" : (!showColumns.panel && !showColumns.t2w ? "1" : "4")} style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Web</th>}
                {showColumns.phone && <th scope="col" colSpan={showColumns.landline && showColumns.cell ? "7" : (!showColumns.landline && !showColumns.cell ? "1" : "4")} style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Phone</th>}
              </tr>
              <tr>
                <th scope="col" colSpan="5" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Global</th>
                {showColumns.web && <>
                  <th scope="col" colSpan="1" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Total</th>
                  {showColumns.panel && <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Panel</th>}
                  {showColumns.t2w && <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>T2W</th>}
                </>}
                {showColumns.phone && <>
                  <th scope="col" colSpan="1" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Total</th>
                  {showColumns.landline && <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Landline</th>}
                  {showColumns.cell && <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Cell</th>}
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
              ))}
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
