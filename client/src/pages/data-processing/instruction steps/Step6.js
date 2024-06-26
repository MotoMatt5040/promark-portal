import Accordion from "react-bootstrap/Accordion";
import React from "react";

export default function Step6() {
  return (
    <Accordion.Item eventKey="5">
      <Accordion.Header>Step 6: Create the project<i>&nbsp;dat&nbsp;</i>file</Accordion.Header>
      <Accordion.Body>
        <p>
          Navigate to the survey in Acuity <b>-> Analyze -> Export Responses</b> (the location where you created the <b>order</b> extraction task.)<br/>
          And UNCLE extraction task should have been created for you titled &lt;PRC#&gt;.dat<br/>
          If this has not been done for you already then do the following:<br/>
          &emsp;Click the hamburger menu on the <b>order</b> extraction task. <br/>
          &emsp;Click <b>copy</b><br/>
          &emsp;Change the name and destination file name to <b>&lt;project number&gt;dat</b><br/>
          &emsp;Uncheck <b>Merge multiple mention responses and open-ends</b><br/>
          &emsp;Click <b>[Export]</b> to save the task.<br/>
          Allow the task to run until the status indicates <b>Completed</b>.<br/>
          Download the file to your projects <b>[DATABASE]</b> folder. <br/>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}