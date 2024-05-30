import React from "react";

export default function Step7() {
  return (
    <div style={styleContainer}>
      <h1>Step 7: Run the file through USort</h1>
      <p>
        Open <b>xfile.csv</b> and <b>&lt;projectid&gt;dat.csv</b>.<br/>
        Copy the <b>2nd</b> row of the xfile <i>(the row of x's)</i> and insert it under the <b>header</b> row of the dat file.<br/>
        &ensp;<i>Note: This is done so that the width of each data column is properly set for USort. It is important that you <b>***DO NOT SKIP***</b> this step.</i><br/>
        Save and close the dat file.<br/>
        Open <b>USort</b><br/>
        Check the following: <br/>
        &ensp;<b>Expand Delimeters</b><br/>
        &emsp;<i>Then...</i><br/>
        &ensp;<b>Header</b><br/>
        In the <b>Input Files</b> <i>(middle)</i> section, click <b>[Browse]</b> and navigate to your dat file<br/>
        On the right side click <b>[Report File]</b> and save it as <b>expand.txt</b> in the <b>[DATABASE]</b> folder. <br/>
        In the <b>Output File</b> <i>(bottom left)</i> click <b>[Browse]</b> and navigate to the <b>[UNCLE]</b> folder. <br/>
        &ensp;Save the file as <b>&lt;project number&gt;dat</b><br/>
        Click <b>[Expand]</b> and wait for the program to finish creating the files.
      </p>
    </div>
  )
}
const styleContainer = {
  display: 'block',
}