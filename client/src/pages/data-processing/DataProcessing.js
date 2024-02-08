// import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from 'react-bootstrap/Table';
import Instructions from "./Instructions";

const DATA_PROCESSING_URL = '/data_processing';
const QUESTIONS_URL = '/questions';
const PROCESS_DATA_URL = '/questions/process_data';
const DOWNLOAD_URL = '/download';
function DataProcessing() {

  const [surveyID, setSurveyID] = useState();
  const [isSurveyIDError, setSurveyIDError] = useState(false);
  const [projectID, setProjectID] = useState();
  const [isProjectIDError, setProjectIDError] = useState(false);
  const [errorMessage, setErrorMesssage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);

  const [selectedValues, setSelectedValues] = useState({});

  const handleCheckboxChange = (question) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [question]: !prevValues[question], // Toggle the boolean value
    }));
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      const initialSelectedValues = {};
      questions.forEach((question) => {
        initialSelectedValues[question] = true;
      });
      setSelectedValues(initialSelectedValues);
    }
  }, [questions]);

  const handleShow = async (event) => {
    event.preventDefault();
    try {
      let config = {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      const response = await axios.post(
        DATA_PROCESSING_URL + QUESTIONS_URL,
        { surveyID, projectID },
        config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for data processing')
      }
        // console.log(JSON.stringify(response));
      setQuestions(JSON.parse(JSON.stringify(response.data)));
    } catch (error) {
      if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Login Failed')
      }
    }
    setShow(true)
  };

  const handleDownload = async (event) => {
    event.preventDefault();
    try {
      let config = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      console.log("data")
      console.log(selectedValues);
      const response = await axios.post(
      DATA_PROCESSING_URL + PROCESS_DATA_URL,
      {
        selectedValues,
        totalStyleChecked: document.getElementById("total-style").checked
      },
      config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for data processing')
      }
      // console.log(JSON.stringify(response));
    } catch (error) {
       if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Request Failed')
      }
    }

    axios.get(DATA_PROCESSING_URL + DOWNLOAD_URL, {
      responseType: 'blob',
      headers: {
            'Content-Type': 'application/json',
          }
    })
      .then((obj) => {
        console.log(obj.data)
        const url = URL.createObjectURL(obj.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = projectID + ' data.zip';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error(error))
  }

   const handleSurveyIDChange = (e) => {
    const value = e.target.value;
    setSurveyID(value);
    setSurveyIDError(value.length < 3);
  };

  const handleProjectIDChange = (e) => {
    const value = e.target.value;
    setProjectID(value);
    setProjectIDError(value.length < 5);
  };

    return (
      <div>
        <div className='p-4 text-center bg-light' style={headerStyle}>
          <div className='dp-form' style={formDiv}>
            <Form
              noValidate
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
                      error={isSurveyIDError}
                      autoComplete="off"
                      onChange={handleSurveyIDChange}
                      value={surveyID}
                      label="Acuity Survey ID"
                      required
                      variant="standard"
                    />
                  </Box>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupProjectId">

                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      error={isProjectIDError}
                      autoComplete="off"
                      onChange={handleProjectIDChange}
                      value={projectID}
                      label="PRC Project ID"
                      required
                      variant="standard"
                    />
                  </Box>
                </Form.Group>
              </div>
              <div style={formButtons}>
                <Button variant="primary" onClick={handleShow}>Checkboxes</Button>
              </div>
            </Form>
          </div>
        </div>
        <div style={widgetContainerStyle}>
          <Instructions/>
          {
          show
          &&
          <div style={{margin: "1%"}}>
            <div style={{display: 'flex', width: '100%', justifyContent: 'right'}}>
              <Button onClick={handleDownload}>Download</Button>
            </div>
            <h4 style={{display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between'}}>
              <label><b>Inline Total</b></label>
              <Checkbox type="checkbox" name="total-style" id="total-style"/>
            </h4>
            <div style={checkboxContainerStyle}>
              <Table style={{width: "100%"}} striped>
                <thead style={{position: 'sticky', top: '0px', margin: '0 0 0 0;'}}>
                  <tr>
                    <th>QNAME</th>
                    <th>Table</th>
                  </tr>
                </thead>
                <tbody>
                  {(typeof questions === 'undefined') ? (
                      <p>Loading...</p>
                    ) : (
                      questions.map((question ,i) => (
                        <tr key={i}>
                          <td>{question}</td>
                          <td>
                            <Checkbox
                              type="checkbox"
                              name={question}
                              id={question}
                              defaultChecked
                              onChange={() => handleCheckboxChange(question)}
                            />
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
          }
        </div>
      </div>
    )
}
export default DataProcessing;

const headerStyle = {
  // border: '1px solid green',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const widgetContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
}

const invisFormSpacerStyle = {
  // border: '3px solid black',
  display: 'flex',
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

const downloadButtonDivStyle = {
  // border: '1px solid pink',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'right',
  justifyContent: 'right',
  alignContent: 'right',
  // paddingLeft: '30%'
  // width: "100%"
}

const checkboxContainerStyle = {
  display: 'block',
  height: '50vh',
  overflowY: 'scroll'
}
