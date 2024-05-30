import Accordion from "react-bootstrap/Accordion";
import React from "react";

export default function Step4() {
  return (
     <div style={styleContainer}>
      <h1>Step 4: Click Checkboxes</h1>
      <p>
        <i>Note: If you have already created an UNCLE extraction task for your project, this will delete it. A new one will be created automatically for you later.</i><br/>
        <br/>
        Uncheck the boxes for tables that will be skipped. These will include fills, computations, OS, OE, etc...
      </p>
    </div>
  )
}

const styleContainer = {
  display: 'block',
}