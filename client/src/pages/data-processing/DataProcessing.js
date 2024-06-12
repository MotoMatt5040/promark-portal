import React, {useEffect, useState} from 'react';
import axios from "../../api/axios";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import Sidebar from "./Sidebar";
import Step from "./Step";
import UncleTables from "./UncleTables";
import CheckboxForm from "./CheckboxForm";
import SurveyForm from "./SurveyForm";
import Cookies from 'js-cookie';

const DATA_PROCESSING_URL = '/data_processing';
const PROCESS_DATA_URL = '/questions/process_data';
const DOWNLOAD_URL = '/download';


const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': Cookies.get("csrf_token")
  }
};

function DataProcessing() {

  const [surveyID, setSurveyID] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [surveyName, setSurveyName] = useState('Please enter project info');
  const [selectedSection, setSelectedSection] = useState('create-order');
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [uncleTables, setUncleTables] = useState();
  const [taskList, setTaskList] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [extractionId, setExtractionId] = useState('');

  const [comID, setComID] = useState('');
  const [comName, setComName] = useState('');
  const [selectedComSection, setSelectedComSection] = useState('create-order');
  const [comDownloadDisabled, setComDownloadDisabled] = useState(true);
  const [comTaskName, setComTaskName] = useState('');
  const [comExtractionId, setComExtractionId] = useState('');
  const [comQuestions, setComQuestions] = useState([]);
  const [comTaskList, setComTaskList] = useState([])


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
      const response = await axios.post(url, data, {headers: {'Content-Type': 'application/json'}});
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

  const handleDownload = (event) => {
    event.preventDefault();
    axios
      .get(DATA_PROCESSING_URL + DOWNLOAD_URL, {
        responseType: 'blob',
        config,
      })
      .then((response) => {
        const survey_n = surveyName.split(' ')[0];
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

  const handleIDChange = async (e, type) => {
    const value = e.target.value;

    if (type === 'survey') {
      setSurveyID(value);
    } else if (type === 'com') {
      setComID(value);
    }
    resetState(type)

    if (value.length >= 3 && value.length <= 6) {
      const endpoint = type === 'survey' ? '/data_processing/survey_name' : '/data_processing/com_file_name';
      const data = await fetchData(endpoint, { surveyID: value });
      const taskListData = await fetchData('/data_processing/task_list', { surveyID: value });
      setTaskList(taskListData || []);

      // If valid data is found, set the name of the survey
      if (data) {
        if (type === 'survey') {
          setSurveyName(data);
        } else if (type === 'com') {
          setComName(data);
        }
      } else {
        if (type === 'survey') {
          setSurveyName('Invalid Survey ID');
        } else if (type === 'com') {
          setComName('Invalid COM ID');
        }
      }
    } else {
      if (type === 'survey') {
        setSurveyName('Invalid Survey ID');
      } else if (type === 'com') {
        setComName('Invalid COM ID');
      }
    }
  };

  const resetState = (type) => {
    if (type === 'survey') {
      setDownloadDisabled(true);
      setTaskName('');
      setExtractionId('');
      setQuestions([]);
    } else if (type === 'com') {
      setComDownloadDisabled(true);
      setComTaskName('');
      setComExtractionId('');
      setComQuestions([]);
    }
  };

  const handleTaskSelectChange = (e, setTaskName, setExtractionId, taskList) => {
    const selectedTaskName = e.target.value;
    const selectedTask = taskList.find((task) => task.Name === selectedTaskName);
    if (selectedTask) {
      setTaskName(selectedTask.Name);
      setExtractionId(selectedTask.ExtractionId);
    }
  };

  const handleHasTable = async () => {
    var requestPayload = {
      selectedValues,
      totalStyleChecked: document.getElementById('total-style').checked,
      case: document.getElementById('case').checked,
      style: document.getElementById("total-style").checked
    };
    await fetchData(DATA_PROCESSING_URL + '/has_table', requestPayload);

    requestPayload = {
      selectedValues,
      totalStyleChecked: document.getElementById('total-style').checked,
    };
    const data = await fetchData(DATA_PROCESSING_URL + PROCESS_DATA_URL, requestPayload);
    if (data) {
      setUncleTables(data);
    }
  };

  return (
    <div>
      <div className='p-4 text-center bg-light' style={headerStyle}>
        <h4>{surveyName}</h4>
        <div className='dp-form' style={formDiv}>
          <SurveyForm
            surveyID={surveyID}
            handleIDChange={handleIDChange}
            comID={comID}
            taskList={taskList}
            comTaskList={comTaskList}
            setTaskName={setTaskName}
            setExtractionId={setExtractionId}
            setComTaskName={setComTaskName}
            setComExtractionId={setComExtractionId}
            handleShow={handleShow}
            handleTaskSelectChange={handleTaskSelectChange}
            taskName={taskName}
            comTaskName={comTaskName}
          />
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
              <label><b>Sentence Case</b></label>
              <Checkbox type="checkbox" name="case" id="case"/>
            </h6>
            <div style={{borderLeft: "1px solid gray", paddingLeft: "1vw"}}>
              <div style={checkboxContainerStyle}>
                <CheckboxForm questions={questions} handleCheckboxChange={handleCheckboxChange}/>
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
