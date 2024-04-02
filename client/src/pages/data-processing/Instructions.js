import Accordion from 'react-bootstrap/Accordion';
import React from 'react';
import Step1 from "./instruction steps/Step1";
import Step2 from "./instruction steps/Step2";
import Step3 from "./instruction steps/Step3";
import Step4 from "./instruction steps/Step4";
import Step5 from "./instruction steps/Step5";
import Step6 from "./instruction steps/Step6";
import Step7 from "./instruction steps/Step7";
import Step8 from "./instruction steps/Step8";
import Step9 from "./instruction steps/Step9";
import Step10 from "./instruction steps/Step10";
import Step11 from "./instruction steps/Step11";

function Instructions() {
  return (
    <Accordion style={accordionStyle} alwaysOpen>
      <Step1/>
      <Step2/>
      <Step3/>
      <Step4/>
      <Step5/>
      <Step6/>
      <Step7/>
      <Step8/>
      <Step9/>
      <Step10/>
      <Step11/>
    </Accordion>
  )
}

export default Instructions;


const accordionStyle = {
  // border: '1px solid green',
  display: 'flex',
  flexDirection: 'column',
  width: '49%',
  margin: "1%"
}
