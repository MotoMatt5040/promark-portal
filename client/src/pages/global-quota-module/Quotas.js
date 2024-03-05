import React, {useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import Table from 'react-bootstrap/Table';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

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
      {Object.keys(data).length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              {/*<TableCell>Web StratumId</TableCell>*/}
              {/*<TableCell>Web Status</TableCell>*/}
              {/*<TableCell>LL StratumId</TableCell>*/}
              {/*<TableCell>LL Status</TableCell>*/}
              {/*<TableCell>Cell StratumId</TableCell>*/}
              {/*<TableCell>Cell Status</TableCell>*/}
              <TableCell>Criterion</TableCell>
              <TableCell>Objective</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>To Do</TableCell>
              <TableCell>Web Frequency</TableCell>
              <TableCell>LL Frequency</TableCell>
              <TableCell>Cell Frequency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data.Criterion).map((key, index) => (
              <TableRow key={index}>
                {/*<TableCell>{data["Web StratumId"][index]}</TableCell>*/}
                {/*<TableCell>{data["Web Status"][index]}</TableCell>*/}
                {/*<TableCell>{data["LL StratumId"][index]}</TableCell>*/}
                {/*<TableCell>{data["LL Status"][index]}</TableCell>*/}
                {/*<TableCell>{data["Cell StratumId"][index]}</TableCell>*/}
                {/*<TableCell>{data["Cell Status"][index]}</TableCell>*/}
                <TableCell>{data.Criterion[index]}</TableCell>
                <TableCell>{data.Objective[index]}</TableCell>
                <TableCell>{data.Frequency[index]}</TableCell>
                <TableCell>{data['To Do'][index]}</TableCell>
                <TableCell>{data['Web Frequency'][index]}</TableCell>
                <TableCell>{data['LL Frequency'][index]}</TableCell>
                <TableCell>{data['Cell Frequency'][index]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
export default Quotas;

const headerStyle = {
  // border: '1px solid green',
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
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
}

const formTextBox = {
  // border: '1px solid green',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
  width: '70%'
}
