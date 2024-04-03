import React from "react";

export default function Step2() {
  return (
    <div style={styleContainer}>
      <h1>Step 2: Create directories</h1>
      <p>
        Create a folder called <b>[DATAPROC]</b> inside the project folder. <br/>
        Create folders called <b>[DATABASE]</b> and <b>[UNCLE]</b> inside the <b>[DATAPROC]</b> folder. <br/>
        Create a folder called <b>[OUTPUT]</b> inside the <b>[UNCLE]</b> folder. <br/>
        The project directories should have the following format. <br/>
        &ensp; <b>i:PROJ\&lt;prc project number&gt;</b> <br/>
        &emsp;&emsp;&emsp;<b>&gt;[DATAPROC]</b> <br/>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>&gt;[DATABASE]</b><br/>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>&gt;[UNCLE]</b><br/>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>&gt;[OUTPUT]</b><br/>
      </p>
    </div>
  )
}

const styleContainer = {
  display: 'block',
}
