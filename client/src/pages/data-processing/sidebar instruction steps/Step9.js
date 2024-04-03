import Accordion from "react-bootstrap/Accordion";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export default function Step9({ defaultActiveKeys }) {
  let cleanup_instructions = "The tables output by the program aren't always in the proper finalized format for output.";
  return (
    <div style={styleContainer}>
      <h1>Step 9: <Tooltip title={cleanup_instructions}>&nbsp;Table Cleanup</Tooltip></h1>
      <p>
        Open the <b>tables.txt</b> file in the <b>[UNCLE]</b> folder.<br/>
        Open the <b>Uncle</b> file (<b>.j</b>) if it is not already open<br/>
        While inside of the <b>tables.txt</b> file, press <b>[ctrl+a]</b> then <b>[ctrl+c]</b><br/>
        Navigate to the <b>Uncle</b> file and type <b>edit all</b>, then press <b>[ctrl+v]</b><br/>
        <br/>
        For simplicity sake, every step will begin with the same command <b>-> edit all</b>
      </p>
      <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.parent} flush alwaysOpen>
        <Accordion.Item eventKey="9-1">
          <Accordion.Header>
            <Tooltip
              title="All D//S scores have an indentation with &AI2, this will indent 2 spaces. This indentation
                should only be included on lines that have a 'Total'."
              arrow>
              Fixing Indentations and D//S scores
            </Tooltip>
          </Accordion.Header>
        <Accordion.Body>
          <p>
            Useful Tips:<br/>
            &emsp;Press <b>[ctrl+h]</b><br/>
            <br/>
            &emsp;&emsp;Find: <b>&AI2 UNS</b><br/>
            &emsp;&emsp;Replace: <b>UNS</b><br/>
            <br/>
            &emsp;&emsp;Find: <b>&AI2 NO OPI</b><br/>
            &emsp;&emsp;Replace: <b>NO OPI</b><br/>
            <br/>
            &emsp;&emsp;Find: <b>&AI2 OTH</b><br/>
            &emsp;&emsp;Replace: <b>OTH</b><br/>
            <br/>
            &emsp;Press <b>[ctrl+f]</b> and search for <b>[</b> (bracket)<br/>
            &emsp;&emsp;Replace the fill text with the appropriate
            <span style={{"color": "#0000ff"}}>
              <Tooltip
                title="Common fills include
                more or less likely,
                support or oppose,
                agree or disagree,
                approve or disapprove,
                etc..."
                arrow>
                &nbsp;text
              </Tooltip>
            </span>.<br/>
            <br/>
            Some tables may require D//S scores but the output may not have added or indented them. The syntax is
            as follows:<br/>
          </p>
          <pre>
              &emsp;R *D//S (AGREE - DISAGREE) ;NONE      ;EX (R3-R4) ;HP<br/>
              &emsp;R &UT- TOTAL AGREE         ;&lt;col&gt;-1:2 ;HP<br/>
              &emsp;R &UT- TOTAL DISAGREE      ;&lt;col&gt;-3:4 ;HP<br/>
              &emsp;R &AI2 STRONGLY AGREE      ;&lt;col&gt;-1   ;HP<br/>
              &emsp;R &AI2 SOMEWHAT AGREE      ;&lt;col&gt;-2   ;HP<br/>
              &emsp;R &AI2 SOMEWHAT DISAGREE   ;&lt;col&gt;-3   ;HP<br/>
              &emsp;R &AI2 STRONGLY DISAGREE   ;&lt;col&gt;-4   ;HP<br/>
              &emsp;R NO ANSWER                ;&lt;col&gt;N1:4 ;NOR SZR<br/>
            </pre>
        </Accordion.Body>
      </Accordion.Item>
        <Accordion.Item eventKey="9-2">
        <Accordion.Header>Fixing No Answer codes</Accordion.Header>
        <Accordion.Body>
          <p>
            In some instances the <b>No Answer</b> row will have choice codes that are not in proper order. These
            issue may look like
            <span style={{"color": "#0000ff"}}>
              <Tooltip
                title="R NO ANSWER ;NOTR(10:11:01,15:10,02,03,:04) ;NOR SZR"
                arrow>
                &nbsp;this&nbsp;
              </Tooltip>
            </span>
            when it should look as follows: <b>R NO ANSWER ;NOTR(10:11,1:15) ;NOR SZR</b><br/>
          </p>
        </Accordion.Body>
      </Accordion.Item>
        <Accordion.Item eventKey="9-3">
            <Accordion.Header>
              <Tooltip
                title="Not all qualifiers will be properly added to each table, be sure to check the survey to verify
                what needs a qualifier. The qualifier label may also need to be changed."
                arrow>
                  Fixing Qualifiers
              </Tooltip>
            </Accordion.Header>
          <Accordion.Body>
            <p>
              Qualifiers use the following syntax: <b>Q R(10:11,01)</b><br/>
              Default tables use the following syntax: <b>R BASE==TOTAL SAMPLE ;ALL ;HP NOVP</b><br/>
              Qualifier tables use the following syntax: <b>R BASE==
              <span style={{"color": "#0000ff"}}>
                <Tooltip title="This may be changed to the qualifying criteria. e.g. PARENT==YES, Q10==1,2,
                Q10==AGREE" arrow>
                  &nbsp;TOTAL ASKED&nbsp;
                </Tooltip>
              </span>
              ;ALL ;HP NOVP</b>
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="9-4">
          <Accordion.Header>Identifying Ranks</Accordion.Header>
          <Accordion.Body>
            <p>
              Ranks use the following syntax: <b>O RANK</b><br/>
              <br/>
              We use ranks on tables where multiple choices are allowed. Unless specified otherwise, it is safe to
              assume all multi-choice tables will include ranking.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

const styleContainer = {
  display: 'block'
}
