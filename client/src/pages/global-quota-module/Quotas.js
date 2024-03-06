import React, {useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from 'react-bootstrap/Table';
// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function Quotas() {

  const [webSurveyID, setWebSurveyID] = useState();
  const [landlineSurveyID, setLandlineSurveyID] = useState();
  const [cellSurveyID, setCellSurveyID] = useState();

  const [webSurveyName, setWebSurveyName] = useState('Web Survey ID')
  const [landlineSurveyName, setLandlineSurveyName] = useState('Landline Survey ID')
  const [cellSurveyName, setCellSurveyName] = useState('Cell Survey ID')

  const [isWebSurveyIDError, setWebSurveyIDError] = useState(false);
  const [isLandlineSurveyIDError, setLandlineSurveyIDError] = useState(false);
  const [isCellSurveyIDError, setCellSurveyIDError] = useState(false);

  const [webData, setWebData] = useState({});
  const [landlineData, setLandlineData] = useState({});
  const [cellData, setCellData] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {

  }, []);

  const handleRun = async () => {
    setWebData({});
    setLandlineData({});
    setCellData({});
    if(!isWebSurveyIDError) {
      await getSurveyQuotas('web', webSurveyID);
    }
    if(!isLandlineSurveyIDError) {
      await getSurveyQuotas('landline', landlineSurveyID);
    }
    if(!isCellSurveyIDError) {
      await getSurveyQuotas('cell', cellSurveyID);
    }
    await axios.get(
      "/quotas/merge",
      {
        headers: {
          'Content-Type': 'application/json'
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
    axios.get("/quotas/check")
  }

  const handleSurveyIDChange = (e) => {
    const value = e.target.value;
    const source_id = e.target.id;

    switch (source_id) {
      case "web":
        setWebSurveyID(value);
        setWebSurveyIDError(value.length < 3);
        if(value.length > 2) {
          getSurveyName(source_id, value);
        }
        break;
      case "landline":
        setLandlineSurveyID(value);
        setLandlineSurveyIDError(value.length < 5);
        if(value.length > 4) {
          getSurveyName(source_id, value);
        }
        break;
      case "cell":
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
        }
    })
      .then((response) => {
        switch (source) {
          case 'web':
            setWebSurveyName(response.data);
            break;
          case 'landline':
            setLandlineSurveyName(response.data);
            break;
          case 'cell':
            setCellSurveyName(response.data);
            break;
          default:
            return '';
        }
      })
      .catch((error) => {
        console.error("Error fetching survey name", error)
        switch (source) {
          case 'web':
            setWebSurveyName("Invalid Web Survey ID");
            setWebSurveyIDError(true)
            break;
          case 'landline':
            setLandlineSurveyName("Invalid Landline Survey ID");
            setLandlineSurveyIDError(true)
            break;
          case 'cell':
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
        }
    })
      .then((response) => {
        switch (source) {
          case 'web':
            setWebData({});
            setWebData(response.data);
            break;
          case 'landline':
            setLandlineData({});
            setLandlineData(response.data);
            break;
          case 'cell':
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
          <div
            style={formStyle}>
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
                    id="web"
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
                    id="landline"
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
                    id="cell"
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
        {Object.keys(data).length > 0 && (
          <Table style={{width: "50%", border: '1px solid black'}} striped>
            <thead>
              <tr>
                <th scope="col" colSpan="4" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Global</th>
                <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Web</th>
                <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Landline</th>
                <th scope="col" colSpan="3" style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Cell</th>
              </tr>

              <tr>
                {/*<TableCell>Web StratumId</TableCell>*/}
                {/*<TableCell>Web Status</TableCell>*/}
                {/*<TableCell>LL StratumId</TableCell>*/}
                {/*<TableCell>LL Status</TableCell>*/}
                {/*<TableCell>Cell StratumId</TableCell>*/}
                {/*<TableCell>Cell Status</TableCell>*/}
                <th style={{border: '1px solid black'}}>Criterion</th>
                <th style={{border: '1px solid black'}}>Objective</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                <th style={{border: '1px solid black'}}>To Do</th>
                <th style={{border: '1px solid black'}}>Obj</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                <th style={{border: '1px solid black'}}>% Global</th>
                <th style={{border: '1px solid black'}}>Obj</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                <th style={{border: '1px solid black'}}>% Global</th>
                <th style={{border: '1px solid black'}}>Obj</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                <th style={{border: '1px solid black'}}>% Global</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data.Criterion).map((key, index) => (
                <tr key={index}>
                  {/*<td>{data["Web StratumId"][index]}</td>*/}
                  {/*<td>{data["Web Status"][index]}</td>*/}
                  {/*<td>{data["LL StratumId"][index]}</td>*/}
                  {/*<td>{data["LL Status"][index]}</td>*/}
                  {/*<td>{data["Cell StratumId"][index]}</td>*/}
                  {/*<td>{data["Cell Status"][index]}</td>*/}
                  <td style={{borderLeft: "1px solid black"}}>{data.Criterion[index]}</td>
                  <td>{data.Obj[index]}</td>
                  <td>{data.Freq[index]}</td>
                  <td style={{borderRight: "1px solid black"}}>{data['To Do'][index]}</td>

                  <td style={{
                    backgroundColor: (data['Web Status'][index] === "Open") ? "darkgreen" : "crimson",
                    color: "white"
                  }}
                  >
                    {data['W Obj'][index]}
                  </td>
                  <td
                  style={{
                    color:
                      (-1 <= data["W Freq"][index] - data["W Obj"][index] && 1 >= data["W Freq"][index] - data["W Obj"][index]) ? "" :
                        (-10 <= data["W Freq"][index] - data["W Obj"][index] && 10 >= data["W Freq"][index] - data["W Obj"][index]) ? "darkorange" :
                          "crimson",
                    backgroundColor:
                      (-1 > data["W Freq"][index] - data["W Obj"][index]) ? "" :
                        (-1 <= data["W Freq"][index] - data["W Obj"][index] && 1 >= data["W Freq"][index] - data["W Obj"][index]) ? "lightgreen" :
                          (10 >= data["W Freq"][index] - data["W Obj"][index] && 2 <= data["W Freq"][index] - data["W Obj"][index]) ? "lightyellow" :
                            "lightpink"
                  }}>
                    {data['W Freq'][index]}
                  </td>
                  <td style={{borderRight: "1px solid black"}}>{data['W%'][index]}</td>

                  <td style={{
                    backgroundColor: (data['LL Status'][index] === "Open") ? "darkgreen" : "crimson",
                    color: "white"
                  }}
                  >
                    {data['L Obj'][index]}
                  </td>
                  <td
                  style={{
                    color:
                      (-1 <= data["L Freq"][index] - data["L Obj"][index] && 1 >= data["L Freq"][index] - data["L Obj"][index]) ? "" :
                        (-10 <= data["L Freq"][index] - data["L Obj"][index] && 10 >= data["L Freq"][index] - data["L Obj"][index]) ? "darkorange" : "crimson",
                    backgroundColor:
                      (-1 > data["L Freq"][index] - data["L Obj"][index]) ? "" :
                        (-1 <= data["L Freq"][index] - data["L Obj"][index] && 1 >= data["L Freq"][index] - data["L Obj"][index]) ? "lightgreen" :
                          (10 >= data["L Freq"][index] - data["L Obj"][index] && 2 <= data["L Freq"][index] - data["L Obj"][index]) ? "lightyellow" : "lightpink"
                  }}>
                    {data['L Freq'][index]}
                  </td>
                  <td style={{borderRight: "1px solid black"}}>{data['L%'][index]}</td>

                  <td
                    style={{
                      backgroundColor: (data['Cell Status'][index] === "Open") ? "darkgreen" : "crimson",
                      color: 'white'
                  }}
                  >
                    {data['C Obj'][index]}
                  </td>
                  <td
                  style={{
                    color:
                      (-1 <= data["C Freq"][index] - data["C Obj"][index] && 1 >= data["C Freq"][index] - data["C Obj"][index]) ? "" :
                        (-10 <= data["C Freq"][index] - data["C Obj"][index] && 10 >= data["C Freq"][index] - data["C Obj"][index]) ? "darkorange" : "crimson",
                    backgroundColor:
                      (-1 > data["C Freq"][index] - data["C Obj"][index]) ? "" :
                        (-1 <= data["C Freq"][index] - data["C Obj"][index] && 1 >= data["C Freq"][index] - data["C Obj"][index]) ? "lightgreen" :
                          (10 >= data["C Freq"][index] - data["C Obj"][index] && 2 <= data["C Freq"][index] - data["C Obj"][index]) ? "lightyellow" : "lightpink"
                  }}>
                    {data['C Freq'][index]}
                  </td>
                  <td style={{borderRight: "1px solid black"}}>{data['C%'][index]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

    </div>
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
  // border: '1px solid black blue',
  display: 'flex',
  flexDirection: 'row',
  width: "40%",
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const formStyle = {
  // border: '1px solid black red',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
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
