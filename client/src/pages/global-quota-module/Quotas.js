import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from 'react-bootstrap/Table';

function Quotas() {

  const [webSurveyID, setWebSurveyID] = useState();
  const [landlineSurveyID, setLandlineSurveyID] = useState();
  const [cellSurveyID, setCellSurveyID] = useState();


  const [webSurveyName, setWebSurveyName] = useState('Please enter web project info')
  const [landlineSurveyName, setLandlineSurveyName] = useState('Please enter landline project info')
  const [cellSurveyName, setCellSurveyName] = useState('Please enter cell project info')

  const [isWebSurveyIDError, setWebSurveyIDError] = useState(false);
  const [isLandlineSurveyIDError, setLandlineSurveyIDError] = useState(false);
  const [isCellSurveyIDError, setCellSurveyIDError] = useState(false);

  useEffect(() => {

  }, []);

  const handleRun = async (event) => {
    event.preventDefault();
    // axios.get("/quotas/data", {
    //   responseType: 'blob',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // })
    //   .then((obj) => {
    //     const survey_n = webSurveyName.substring(0, webSurveyName.indexOf(' '));
    //     console.log(obj.data)
    //     const url = URL.createObjectURL(obj.data);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = survey_n + '.zip';
    //     a.style.display = 'none';
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();
    //     URL.revokeObjectURL(url);
    //   })
    //     .catch(error => console.error(error))
  };

  const handleSurveyIDChange = async (e) => {

    const value = e.target.value;
    const source_id = e.target.id;


    switch (source_id) {
      case "web":
        setWebSurveyID(value);
        setWebSurveyIDError(value.length < 3);
        console.log('web')
        if(value.length > 2) {
          getSurveyName(source_id, value);
        }
        break;
      case "landline":
        setLandlineSurveyID(value);
        setLandlineSurveyIDError(value.length < 5);
        console.log('ll')
        if(value.length > 4) {
          getSurveyName(source_id, value);
        }
        break;
      case "cell":
        setCellSurveyID(value);
        setCellSurveyIDError(value.length < 5);
        console.log('cell')
        if(value.length > 4) {
          getSurveyName(source_id, value);
        }
        break;
      default:
        console.log("Invalid id")
        break;
    }
  }

  const getSurveyName = (source, surveyID) => {
    axios.post(
      '/quotas/survey_name',
      { source, surveyID },
      {
        headers: {
          'Content-Type': 'application/json',
        }
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching survey name", error)
        setWebSurveyName("Invalid Survey ID")
      })
  }

  return (
    <div>
      <div className='p-4 text-center bg-light' style={headerStyle}>
        <h4>{webSurveyName}</h4>
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
                    label="Acuity Survey ID"
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
                    label="Voxco Landline Survey ID"
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
                    label="Voxco Cell Survey ID"
                    required
                    variant="standard"
                  />
                </Box>
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
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

const formButtons = {
  // border: '1px solid pink',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'left',
  alignContent: 'center',
  width: "30%"
}
