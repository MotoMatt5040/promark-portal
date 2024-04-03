import React from "react";

export default function Step5() {
  return (
    <div style={styleContainer}>
      <h1>Step 5: Click Download</h1>
      <p>
        <i>Note: This will automatically create an UNCLE extraction task based off of your <b>order</b> extraction task</i><br/>
        Download the zip file and copy the files into the following directories: <br/>
        &ensp;<b>[DATABASE]</b><br/>
        &emsp;<b>layout.csv</b><br/>
        &emsp;<b>xfile.csv</b><br/>
        &ensp;<b>[UNCLE]</b><br/>
        &emsp;<b>tables.txt</b><br/>
      </p>
    </div>
  )
}

const styleContainer = {
  display: 'block',
}