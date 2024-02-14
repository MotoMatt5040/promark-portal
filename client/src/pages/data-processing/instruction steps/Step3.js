import Accordion from "react-bootstrap/Accordion";
import surveyDropdown from "../assets/survey_dropdown.PNG";
import surveyIdImage from "../assets/survey_id.png";
import React from "react";

export default function Step3() {
  return (
    <Accordion.Item eventKey="2">
      <Accordion.Header>Step 3:  Enter Survey ID and Project Number</Accordion.Header>
      <Accordion.Body>
        <p>
          Finding Survey ID: <i>Note: This can only be done while in the Surveys section.</i><br />
          &ensp; Click the dropdown in the top left corner <br />
          &emsp; <img src={surveyDropdown} alt="Survey Dropdown" style={{maxWidth: "100%"}} />
          &emsp; <img src={surveyIdImage} alt="Survey ID" style={{maxWidth: "100%"}} /> <br />
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}