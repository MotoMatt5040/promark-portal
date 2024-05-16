import React from "react";

export default function Step1() {
  return (
    <div style={styleContainer}>
      <h1>Step 1: Create order.csv</h1>
      <p>
        <i>Note: This only works if there is a project in Acuity.</i><br/>
        <br/>
        Navigate to the survey in Acuity <b>-> Analyze -> Export Responses</b> <br />
        &ensp; Press: <b>[New] -> CSV</b> <br />
        &ensp; Name: <b>order</b> <br />
        &ensp; Destination File Name: <b>order</b> <br />
        &ensp; Check the following: <br />
        &emsp; <b>Export completed</b> <br />
        &emsp; <b>Export only a subset</b> <br />
        &ensp;&emsp; Press: <b>[Select Variables]</b> <br />
        &ensp; Select all variables to include <br />
        &ensp;&emsp;<b>Always include the following:</b><br/>
        &ensp;&emsp;&ensp;<b>Case ID</b><br/>
        &ensp;&emsp;&ensp;<b>Last Connection Date</b><br/>
        &ensp;&emsp;&ensp;<b>Start time of last connection</b><br/>
        &ensp;&emsp;&ensp;<b>Total Duration (sec.)</b><br/>
        &ensp; Check <b>ONLY</b> the following: <i>Note: these are located at the bottom</i><br />
        &emsp; <b>Include header</b> <br />
        &emsp; <b>Strip HTML from labels</b> <br />
        &emsp; <b>Remove curly brackets and spaces of system variables</b><br/>
        &emsp; <b>Merge multiple mention responses and open-ends</b> <br />
        Once finished, click <b>[Export]</b> in the top right.<br/>
        No further instructions for this task. Please proceed to step 2.
      </p>
    </div>
  )
}

const styleContainer = {
  display: 'block',
}
