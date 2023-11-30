import Accordion from 'react-bootstrap/Accordion';
import surveyDropdown from "./assets/survey_dropdown.PNG";
import surveyIdImage from './assets/survey_id.png';
import jt from './assets/j-t.png';
import TableBody from './tableBody.js'
import projTitle from "./assets/project-title-caseid.png"

function Instructions() {

  return (
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
        <Accordion.Header>Step 2: Create directories</Accordion.Header>
          <Accordion.Body>
            <p>
              Create a folder called <b>[DATAPROC]</b> inside the project folder. <br/>
              Create a folder called <b>[DATABASE]</b> and <b>[UNCLE]</b> inside the <b>[DATAPROC]</b> folder. <br/>
              Create a folder called <b>[OUTPUT]</b> inside the <b>[UNCLE]</b> folder. <br/>
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
        <Accordion.Header>Step 4: Press Layout</Accordion.Header>
        <Accordion.Body>
          <p>Uncheck the boxes for tables that will be skipped. These will include fills, computations, OS, OE, etc...</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>Step 5: Press Download</Accordion.Header>
        <Accordion.Body>
          <p>
            Download the zip file and copy the files into the following directories: <br/>
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
          <p><i>Note: There are 2 ways to do this. Copying the project from an older file and editing the data, or creating a new file from scratch.</i></p>
          <Accordion>
            <Accordion.Item eventKey="7-1">
              <Accordion.Header>Step 1: Copy/Create</Accordion.Header>
              <Accordion.Body>
                <Accordion>
                  <Accordion.Item  eventKey="7-1-1">
                    <Accordion.Header>Copy Uncle file:&nbsp;<i>Recommended for projects with standardized tables and processes (core/os, double weights)</i></Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Navigate to an earlier project and copy the <b>.j</b> and <b>.t</b> files.<br />
                        <img src={jt} alt="jt" /><br/>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item  eventKey="7-1-2">
                    <Accordion.Header>Create Uncle file:&nbsp;<i>Recommended for simple projects</i></Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Press <b>Windows Key</b> and type Uncle<br/>
                        Press <b>Enter</b><br/>
                        Browse to the project folder and save the uncle file as the project number.<br/>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
              <Accordion.Item eventKey="7-2">
                <Accordion.Header>Step 2: Adjust&nbsp;<b>Title</b>&nbsp;and&nbsp;<b>CaseID Position</b></Accordion.Header>
                <Accordion.Body>
                  <p>
                    Open the uncle file (<b>.j</b>)<br/>
                    Click <b>[Project]</b> in the middle section of the ribbon.<br/>
                    Edit the title text do the respective project name and date. <br/>
                    <b>Title:</b> &CP <b>&lt;SURVEY NAME&gt;</b> // <b>&lt;MMM&gt;</b>. <b>&lt;DD&gt;</b> - <b>&lt;DD&gt;</b>, <b>&lt;YYYY&gt;</b> &RJ PAGE &PS<br/>
                    <b>Case ID Position:</b><br/>
                    &ensp;<b>First:</b> 1<br/>
                    &ensp;<b>Last:</b> 10<br/>
                    <img src={projTitle} alt="Project/Title" /><br/>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            <Accordion.Item  eventKey="7-3">
              <Accordion.Header>Format of default tables</Accordion.Header>
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
  )
}

export default Instructions;