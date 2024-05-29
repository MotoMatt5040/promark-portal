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
import UncleTables from "./UncleTables";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const DATA_PROCESSING_URL = '/data_processing';
const PROCESS_DATA_URL = '/questions/process_data';
const DOWNLOAD_URL = '/download';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Csrftoken': localStorage.getItem('csrftoken')
  }
}
// TODO add tables.txt data to webpage with highlights over potential errors
// TODO make this new feature editable
// TODO make all copyable table fields editable (e.g. <col>) for ease of copying
// TODO create a hierarchy sidebar for DP steps that updates a container with proper steps text/features


function DataProcessing() {

  const [surveyID, setSurveyID] = useState('');
  const [isSurveyIDError, setSurveyIDError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [surveyName, setSurveyName] = useState('Please enter project info');
  const [selectedSection, setSelectedSection] = useState('create-order');
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [uncleTables, setUncleTables] = useState();
  const [taskList, setTaskList] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [extractionId, setExtractionId] = useState('');

  const handleSelection = (section) => setSelectedSection(section);

  const handleCheckboxChange = (question) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [question]: !prevValues[question],
    }));
  };

  useEffect(() => {
    if (questions.length > 0) {
      const initialSelectedValues = questions.reduce((acc, question) => {
        acc[question] = true;
        return acc;
      }, {});
      setSelectedValues(initialSelectedValues);
    }
  }, [questions]);

  const fetchData = async (url, data) => {
    try {
      const response = await axios.post(url, data, config);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    if (!error?.response) {
      console.error('No Server Response');
    } else if (error.response.status === 401) {
      console.error('Invalid Credentials');
    } else {
      console.error('Request Failed');
    }
  };

  const handleShow = async (event) => {
    event.preventDefault();
    const data = await fetchData(DATA_PROCESSING_URL + '/checkboxes', { extractionId, taskName });
    if (data) {
      setQuestions(data);
      setDownloadDisabled(false);
    }
  };

  const handleDownload = async (event) => {
    event.preventDefault();
    const requestPayload = {
      selectedValues,
      totalStyleChecked: document.getElementById('total-style').checked,
    };
    const data = await fetchData(DATA_PROCESSING_URL + PROCESS_DATA_URL, requestPayload);
    if (data) {
      setUncleTables(data);
      downloadFile(surveyName, data);
    }
  };

  const downloadFile = (name, data) => {
    axios
      .get(DATA_PROCESSING_URL + DOWNLOAD_URL, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': localStorage.getItem('csrftoken'),
        },
      })
      .then((response) => {
        const survey_n = name.split(' ')[0];
        const url = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${survey_n}.zip`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(handleErrors);
  };

  const handleSurveyIDChange = async (e) => {
    const value = e.target.value;
    setSurveyID(value);
    setSurveyIDError(value.length < 3);
    resetState();

    if (value.length >= 3) {
      const surveyNameData = await fetchData('/data_processing/survey_name', { surveyID: value });
      if (surveyNameData) {
        setSurveyName(surveyNameData);
        const taskListData = await fetchData(DATA_PROCESSING_URL + '/task_list', { surveyID: value });
        setTaskList(taskListData || []);
      } else {
        setSurveyName('Invalid Survey ID');
      }
    }
  };

  const resetState = () => {
    setDownloadDisabled(true);
    setTaskName('');
    setExtractionId('');
    setQuestions([]);
  };

  const handleTaskSelectChange = (e) => {
    const selectedTaskName = e.target.value;
    const selectedTask = taskList.find((task) => task.Name === selectedTaskName);
    if (selectedTask) {
      setTaskName(selectedTask.Name);
      setExtractionId(selectedTask.ExtractionId);
    }
  };

  const handleHasTable = async () => {
    const requestPayload = {
      selectedValues,
      totalStyleChecked: document.getElementById('total-style').checked,
    };
    const data = await fetchData(DATA_PROCESSING_URL + '/has_table', requestPayload);
    setUncleTables(data || []);
  };

    return (
      <div>
        <div className='p-4 text-center bg-light' style={headerStyle}>
          <h4>{surveyName}</h4>
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
                      error={isSurveyIDError}
                      autoComplete="off"
                      onChange={handleSurveyIDChange}
                      value={surveyID}
                      label="Acuity Survey ID"
                      required
                      variant="standard"
                    />
                    <br/>
                    <FormControl>
                      <InputLabel id="task-list-label">Task List</InputLabel>
                      <Select
                        labelId="task-list-label"
                        id="task-list"
                        label="Task List"
                        onChange={handleTaskSelectChange}
                        value={taskName}
                      >
                        {taskList && taskList.map((task, index) => (
                          <MenuItem key={index} value={task.Name}>{task.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br/>
                    <Button variant="primary" type="submit" onClick={handleShow}>Checkboxes</Button>
                  </Box>
                </Form.Group>
              </div>
            </div>
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
                <Button onClick={handleHasTable}>Confirm Tables</Button>
                <Button onClick={handleDownload} disabled={downloadDisabled}>Download</Button>
              </div>
              <h6 style={{display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between'}}>
                <label><b>Inline Total</b></label>
                <Checkbox type="checkbox" name="total-style" id="total-style"/>
              </h6>
              <h6 style={{display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between'}}>
                <label><b>Lower Case</b></label>
                <Checkbox type="checkbox" name="case" id="case"/>
              </h6>
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
        <UncleTables data={uncleTables}/>
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
  flexDirection: 'column',
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
