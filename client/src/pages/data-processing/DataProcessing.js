import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import axios from "../../api/axios";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from 'react-bootstrap/Table';
import Sidebar from "./Sidebar";
import Step from "./Step";

const DATA_PROCESSING_URL = '/data_processing';
const PROCESS_DATA_URL = '/questions/process_data';
const DOWNLOAD_URL = '/download';


// TODO add tables.txt data to webpage with highlights over potential errors
// TODO make this new feature editable
// TODO make all copyable table fields editable (e.g. <col>) for ease of copying
// TODO create a hierarchy sidebar for DP steps that updates a container with proper steps text/features


function DataProcessing() {

  const [surveyID, setSurveyID] = useState();
  const [isSurveyIDError, setSurveyIDError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [surveyName, setSurveyName] = useState('Please enter project info')

  const [selectedSection, setSelectedSection] = useState('create-order');

  const handleSelection = (section) => {
    setSelectedSection(section);
  };

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
            'X-Csrftoken': localStorage.getItem('csrftoken')
          }
        }
      const response = await axios.post(
        DATA_PROCESSING_URL + "/checkboxes",
        { surveyID },
        config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for data processing')
      }
      setQuestions(JSON.parse(JSON.stringify(response.data)));
    } catch (error) {
      if (!error?.response) {
        console.error('No Server Response')
      } else if (error.response.status === 401) {
        console.error('Invalid Credentials')
      } else {
        console.error('Checkboxes Failed')
      }
    }
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
        console.error('No Server Response')
      } else if (error.response.status === 401) {
        console.error('Invalid Credentials')
      } else {
        console.error('Request Failed')
      }
    }

    axios.get(DATA_PROCESSING_URL + DOWNLOAD_URL, {
      responseType: 'blob',
      headers: {
            'Content-Type': 'application/json',
          }
    })
      .then((obj) => {
        const survey_n = surveyName.substring(0, surveyName.indexOf(' '));
        console.log(obj.data)
        const url = URL.createObjectURL(obj.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = survey_n + '.zip';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error(error))
  }

   const handleSurveyIDChange = async (e) => {
    const value = e.target.value;
    setSurveyID(value);
    setSurveyIDError(value.length < 3);
     setQuestions([])
    if (value.length > 2) {
      await axios.post(
        '/data_processing/survey_name',
        { surveyID: e.target.value },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Csrftoken': localStorage.getItem('csrftoken')
          }
      })
      .then((response) => {
        setSurveyName(response.data)
      })
      .catch((error) => {
        console.error("Error fetching survey name", error)
        setSurveyName("Invalid Survey ID")
      })
    }
  };

    return (
      <div>
        <div className='p-4 text-center bg-light' style={headerStyle}>
          <h4>{surveyName}</h4>
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
              </div>
              <div style={formButtons}>
                <Button variant="primary" onClick={handleShow}>Checkboxes</Button>
              </div>
            </Form>
          </div>
        </div>
        <div style={widgetContainerStyle}>
          <div style={styleContainer}>
            <Sidebar handleSelection={handleSelection}/>
            <div className='steps-container' style={stepsContainerStyle}>
              <Step selectedSection={selectedSection}/>
            </div>
            <div >
              <div style={{display: 'flex', width: '100%', justifyContent: 'right'}}>
                <Button onClick={handleDownload}>Download</Button>
              </div>
              <h4 style={{display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between'}}>
                <label><b>Inline Total</b></label>
                <Checkbox type="checkbox" name="total-style" id="total-style"/>
              </h4>
              <div style={{borderLeft: "1px solid gray", paddingLeft: "1vw"}}>
                <div style={checkboxContainerStyle}>
                  <Table style={{width: "100%"}} striped>
                    <thead style={{position: 'sticky', top: '0px', margin: '0 0 0 0'}}>
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
                              <td style={{verticalAlign: 'middle'}}>{question}</td>
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

            </div>
          </div>
        </div>
      </div>
    )
}
export default DataProcessing;

const styleContainer = {
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  width: '100%',
  padding: '1%',
  // border: '1px solid orange',
  justifyContent: 'space-between',
}

const stepsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '40%',
  height: '100%',
  overflow: 'auto',
  flexGrow: '1',
  padding: "1%",
  // border: '1px solid lightgrey',
}

const headerStyle = {
  // border: '1px solid green',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const widgetContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  // border: '1px solid green'
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

const checkboxContainerStyle = {
  display: 'block',
  height: '50vh',
  overflowY: 'scroll',
  // border: '1px solid red',
}
