import Accordion from "react-bootstrap/Accordion";
import React from "react";

export default function Step4() {
  return (
     <Accordion.Item eventKey="3">
      <Accordion.Header>Step 4: Click Checkboxes</Accordion.Header>
      <Accordion.Body>
        <p>Uncheck the boxes for tables that will be skipped. These will include fills, computations, OS, OE, etc...</p>
      </Accordion.Body>
    </Accordion.Item>
  )
}