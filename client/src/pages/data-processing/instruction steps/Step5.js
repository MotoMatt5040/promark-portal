import Accordion from "react-bootstrap/Accordion";
import React from "react";

export default function Step5() {
  return (
    <Accordion.Item eventKey="4">
      <Accordion.Header>Step 5: Click Download</Accordion.Header>
      <Accordion.Body>
        <p>
          Download the zip file and copy the files into the following directories: <br/>
          &ensp;<b>[DATABASE]</b><br/>
          &emsp;<b>layout.csv</b><br/>
          &emsp;<b>xfile.csv</b><br/>
          &ensp;<b>[UNCLE]</b><br/>
          &emsp;<b>tables.txt</b><br/>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}