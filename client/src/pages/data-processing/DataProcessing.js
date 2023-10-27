import Accordion from 'react-bootstrap/Accordion';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import surveyDropdown from "./assets/survey_dropdown.PNG";
import surveyIdImage from './assets/survey_id.png';


const DATA_PROCESSING_URL = '/data_processing';
function SampleUpload() {

   const [validated, setValidated] = useState(false);
   const [surveyID, setSurveyID] = useState(false);
   const [projectID, setProjectID] = useState(false);
   const [errorMessage, setErrorMesssage] = useState('');

   const handleValidation = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      var config = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      const response = await axios.post(
        DATA_PROCESSING_URL,
        { surveyID, projectID },
        config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for data processing')
      }
        console.log(JSON.stringify(response));
      // setSuccess(true)
    } catch (error) {
      if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Login Failed')
      }
    }
  };

    return (
      <div>
        <div className='p-4 text-center bg-light' style={headerStyle}>
          <div className='dp-form' style={formDiv}>
            <Form
              noValidate
              validated={validated}
              onChange={handleValidation}
              onSubmit={handleSubmit}
              style={formStyle}>
              <Form.Group className="mb-3" controlId="formGroupSruveryId">
                <Form.Label>Survey ID</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  onChange={(e) => setSurveyID(e.target.value)}
                  placeholder="Survey ID"
                  required
                />
                <Form.Text id="SurveyIDnote" muted>
                  Step 3
                </Form.Text>
                <Form.Control.Feedback>Good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupProjectId">
                <Form.Label>Project ID</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  onChange={(e) => setProjectID(e.target.value)}
                  placeholder="Project ID"
                  required
                />
                <Form.Text id="SurveyIDnote" muted>
                  Project to data process
                </Form.Text>
                <Form.Control.Feedback>Good!</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit">Run</Button>
            </Form>
          </div>
            <p>Use the drop downs below for further explanations</p>
          </div>


        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Step 1: Create order.csv</Accordion.Header>
              <Accordion.Body>
                <p><i>Note: This only works if there is a project in Acuity.</i></p>
                <br />
                <br />
                <p>
                  Navigate to the survey in acuity -> <b>Analyze -> Export Responses</b> <br />
                  &ensp; Press: <b>[New] -> CSV</b> <br />
                  &ensp; Name: <b>order</b> <br />
                  &ensp; Destination File Name: <b>order</b> <br />
                  &ensp; Check the following: <br />
                  &emsp; <b>Export completed</b> <br />
                  &emsp; <b>Export only a subset</b> <br />
                  &ensp;&emsp; Press: <b>[Select Variables]</b> <br />
                  &ensp; Select all variables to include <br />
                  &ensp; Check the following: <i>Note: these are located at the bottom</i><br />
                  &emsp; <b>Strip HTML from labels</b> <br />
                  &emsp; <b>Merge multiple mention responses and open-ends</b> <br />
                  Once finished, click <b>[Export]</b> in the top right.
                </p>
              </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Step 2: Download order.csv</Accordion.Header>
              <Accordion.Body>
                <p>
                  Create a folder called <b>[DATAPROC]</b> inside the project folder. <br/>
                  Create a folder called <b>[DATABASE]</b> and <b>[UNCLE]</b> inside the <b>[DATAPROC]</b> folder. <br/>
                  Create a folder called <b>[OUTPUT]</b> inside the <b>[UNCLE]</b> folder. <br/>
                  Save <b>order.csv</b> in the <b>[DATABASE]</b> folder for the project you are working on.<br />
                  It is important that this file is named <b>order.csv</b> exactly as specified. <br/>
                  The project directory should have the following format. <br/>
                  &ensp; <b>&lt;project id&gt;</b> <br/>
                  &emsp;&emsp;&emsp;|<br/>
                  &emsp;&emsp;&emsp; <b>[DATAPROC]</b> <br/>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br/>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>[DATABASE]</b><br/>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;. . .<br/>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>[UNCLE]</b><br/>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|<br/>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>[OUTPUT]</b><br/>
                </p>
              </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Step 3:  Enter Survey ID and Project ID</Accordion.Header>
            <Accordion.Body>
              <p>
                Finding Survey ID: <i>Note: This can only be done while in the Surveys section.</i><br />
                &ensp; Click the dropdown in the top left corner <br />
                &emsp; <img src={surveyDropdown} alt="Survey Dropdown"/>
                &emsp; <img src={surveyIdImage} alt="Survey ID"/> <br />
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Step 4: Press Run</Accordion.Header>
            <Accordion.Body>
              <p>After filling out the fields from the previous step you can run the program.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>Step 5: Verifiy the created files</Accordion.Header>
            <Accordion.Body>
              <p>After filling out the fields from the previous step you can run the program.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5">
            <Accordion.Header>Step 6:</Accordion.Header>
            <Accordion.Body>
              <p></p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

    )
}

export default SampleUpload;

const formDiv = {
  display: 'flex',
  flexDirection: 'row',
  width: "30%",
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
}

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}
