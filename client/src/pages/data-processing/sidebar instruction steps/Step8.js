import Accordion from "react-bootstrap/Accordion";
import jt from "../assets/j-t.png";
import projTitle from "../assets/project-title-caseid.png";
import TableBody from "../tableBody";
import React from "react";

export default function Step8({ defaultActiveKeys }) {
  return (
    <div style={styleContainer}>
      <h1>Step 8: Uncle setup</h1>
      <p><i>Note: There are 2 ways to do this. Copying the project from an older file and editing the data, or creating a new file from scratch.</i></p>
      <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.parent} flush>
        <Accordion.Item eventKey="8-1">
          <Accordion.Header>Step 1: Options</Accordion.Header>
          <Accordion.Body>
            <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.child}>
              <Accordion.Item  eventKey="8-1-1">
                <Accordion.Header>Copy Uncle file:&nbsp;<i>Recommended for projects with standardized tables and processes (core/os, double weights)</i></Accordion.Header>
                <Accordion.Body>
                  <p>
                    Navigate to a previously completed project and copy the <b>.j</b> and <b>.t</b> files from the old <b>[UNCLE]</b> folder into the new <b>[UNCLE]</b> folder.<br />
                    <img src={jt} alt="jt" style={{maxWidth: "100%"}} /><br/>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item  eventKey="8-1-2">
                <Accordion.Header>Create Uncle file:&nbsp;<i>Recommended for simple projects</i></Accordion.Header>
                <Accordion.Body>
                  <p>
                    Press <b>Windows Key</b> and type Uncle<br/>
                    Press <b>Enter</b><br/>
                    Click <b>[New Project]</b> and navigate to <b>i\PROJ\&lt;project number&gt;\DATAPROC\UNCLE</b><br/>
                    Save the uncle file as the project number.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
          <Accordion.Item eventKey="8-2">
            <Accordion.Header>Step 2: Adjust&nbsp;<b>Title</b>&nbsp;and&nbsp;<b>CaseID Position</b></Accordion.Header>
            <Accordion.Body>
              <p>
                Open the uncle file (<b>.j</b>) if it is not already open<br/>
                Click <b>[Project]</b> in the middle section of the ribbon.<br/>
                Edit the title text to the respective project name and date. <i>(Note: See screenshot below for example)</i> <br/>
                &emsp;<b>Title:</b> &CP <b>&lt;SURVEY NAME&gt;</b> // <b>&lt;MMM&gt;</b>. <b>&lt;DD&gt;</b> - <b>&lt;DD&gt;</b>, <b>&lt;YYYY&gt;</b> &RJ PAGE &PS<br/>
                &emsp;<b>Case ID Position:</b> Verify these are correct, even when copying.<br/>
                &emsp;&ensp;<b>First:</b> 1<br/>
                &emsp;&ensp;<b>Last:</b> 10<br/>
                Click <b>OK</b><br/>
                <img src={projTitle} alt="Project/Title" style={{maxWidth: "100%"}} /><br/>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        <Accordion.Item  eventKey="8-3">
          <Accordion.Header>Default Tables Scripts: (Note: All carrots must be edited &lt;&gt;)</Accordion.Header>
          <Accordion.Body>
           <TableBody />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

const styleContainer = {
  display: 'block',
}