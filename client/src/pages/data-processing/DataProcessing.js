import Accordion from 'react-bootstrap/Accordion';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import surveyDropdown from "./assets/survey_dropdown.PNG";
import surveyIdImage from './assets/survey_id.png';
import jt from './assets/j-t.png';
import TableBody from './tableBody.js'

import AccordionItem from "react-bootstrap/AccordionItem";


const DATA_PROCESSING_URL = '/data_processing';
function DataProcessing() {

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
        <br/>
        <div className="checkbox-div">

        </div>


        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Step 1: Create order.csv</Accordion.Header>
              <Accordion.Body>
                <p><i>Note: This only works if there is a project in Acuity.</i></p>
                <br />
                <br />
                <p>
                  Navigate to the survey in acuity <b>-> Analyze -> Export Responses</b> <br />
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
                  &emsp; <b>Remove curly brackets and spaces of system variables</b><br/>
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
                  The project directories should have the following format. <br/>
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
            <Accordion.Header>Step 5: Verify the created files</Accordion.Header>
            <Accordion.Body>
              <p>
                Verify the following files have been created in the following directories: <br/>
                &ensp;<b>[DATABASE]</b><br/>
                &emsp;<b>layout.csv</b><br/>
                &emsp;<b>x-file.csv</b><br/>
                &ensp;<b>[UNCLE]</b><br/>
                &emsp;<b>tables.txt</b><br/>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5">
            <Accordion.Header>Step 6: create the project dat file</Accordion.Header>
            <Accordion.Body>
              <p>
                Navigate back to the location where you created the <b>order.csv</b> file in Acuity.<br/>
                Click the dropdown menu on the <b>order</b> extraction task. <br/>
                Click <b>copy</b><br/>
                Change the name and destination file name to <b>&lt;project id&gt;dat</b><br/>
                Uncheck <b>Merge multiple mention responses and open-ends</b><br/>
                Click save and run the extraction task. <br/>
                Download the file to your projects <b>[DATABASE]</b> folder. <br/>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6">
            <Accordion.Header>Step 7: Run the file through USort</Accordion.Header>
            <Accordion.Body>
              <p>
                Open <b>x-file.csv</b> and <b>&lt;projectid&gt;dat.csv</b>.<br/>
                Copy the <b>2nd</b> row of the x-file <i>the row of x's</i> and insert it under the <b>header</b> row of the dat file.<br/>
                &ensp;<i>Note: This is done so that the width of each data column is properly set for USort. It is important that you <b>DO NOT SKIP</b> this step.</i><br/>
                Save and close the dat file.<br/>
                Open <b>USort</b><br/>
                Check the following: <br/>
                &ensp;<b>Expand Delimeters</b><br/>
                &ensp;<b>Header</b><br/>
                In the <b>middle</b> section, click <b>[Browse]</b> and navigate to your dat file<br/>
                On the right side click <b>[Report File]</b> and save it as <b>expand.txt</b> in the <b>[DATABASE</b> folder. <br/>
                On the bottom left click <b>[Browse]</b> and navigated to the <b>[UNCLE]</b> folder. <br/>
                &ensp;Save the file as <b>&lt;project id&gt;dat</b>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7">
            <Accordion.Header>Step 8: Uncle setup</Accordion.Header>
            <Accordion.Body>
              <p><i>Note: There are 2 ways to do this.</i></p>
              <Accordion>
                <Accordion.Item  eventKey="7-1">
                  <Accordion.Header>Copy Uncle file&nbsp;<b>(Recommended)</b></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Navigate to an earlier project and copy the <b>.j</b> and <b>.t</b> files.<br />
                      <img src={jt} alt="jt" />
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item  eventKey="7-2">
                  <Accordion.Header>Create Uncle file&nbsp;<b>(Not Recommended)</b></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Press <b>Windows Key</b> and type Uncle<br/>
                      Press <b>Enter</b><br/>
                      Browse to the project folder and save the uncle file as the project number.<br/>
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item  eventKey="7-3">
                  <Accordion.Header>Copy main tables</Accordion.Header>
                  <Accordion.Body>
                   <TableBody />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="8">
            <Accordion.Header>Step 9:</Accordion.Header>
            <Accordion.Body>

            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="9">
            <Accordion.Header>Step 10:</Accordion.Header>
            <Accordion.Body>

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    )
}

export default DataProcessing;

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
