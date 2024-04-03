import Accordion from "react-bootstrap/Accordion";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export default function Step10({ defaultActiveKeys}) {
  return (
    <div style={styleContainer}>
      <h1>Step 10: Stub Checking</h1>
      <p>
        After stubs have been ran, there are some basic checks that need to be made.
      </p>
      <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.parent} flush>
        <Accordion.Item eventKey="10-1">
          <Accordion.Header>Check table order</Accordion.Header>
          <Accordion.Body>
            <p>
              Verify that the tables are all properly in place. The proper order should be made when the
              <b> order</b> extraction task is created in Acuity. Verify that the order is the same as the survey.
              Tables may be out of order due to programming requirements. Many questions are moved to the front in
              order to be used for screening.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="10-2">
          <Accordion.Header>Check qualifiers</Accordion.Header>
          <Accordion.Body>
            <p>
              Check the survey to see if any questions need qualifiers. In the case that they do, make sure they
              are applied, and make sure that the total base line is updated so that it reflect the proper language
              for the qualifier.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="10-3">
          <Accordion.Header>Verify numbers add up</Accordion.Header>
          <Accordion.Body>
            <p>
              Tables needs to be checked to verify that the amount of answers add up to the total. The only
              exception to this rule are tables that are multi-choice. <br/>
              <br/>
              Questions that have qualifiers need to have the qualifiers checked to verify that the base total for
              that question is equal to what the qualifier total should be.
            </p>
            <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.child}>
              <Accordion.Item eventKey="10-3-1">
                <Accordion.Header>Basic Tables</Accordion.Header>
                <Accordion.Body>
                  <p>
                    Add all the numbers for the choices and verify that they add up to the total. <br/>
                    <br/>
                    Do not include <b>NO ANSWER</b> in the total, however there may be an issue if you see
                    <b> NO ANSWER</b>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="10-3-2">
                <Accordion.Header>Total Tables</Accordion.Header>
                <Accordion.Body>
                  <p>
                    Add all the numbers for the choices and verify that they add up to the total. <br/>
                    <br/>
                    Verify all the numbers for each individual total line adds up to the qualifying total row. <br/>
                    <br/>
                    Verify that the total difference score math is calculated correctly by subtraction the total
                    rows.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="10-3-3">
                <Accordion.Header>Multi-Choice Tables</Accordion.Header>
                <Accordion.Body>
                  <p>
                    These tables are much harder to check proper totals on, in this instance you want to check
                    <b> caseid's</b> to verify the proper amount of cases have an answer on this question. Verify what
                    qualifiers are in place and check for blanks. There should not be any blanks in the first
                    multi-choice column unless a qualifier is present.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="10-4">
          <Accordion.Header>Segmentation</Accordion.Header>
          <Accordion.Body>
            <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.child}>
              <Accordion.Item eventKey="10-4-1">
                <Accordion.Header>What is segmentation?</Accordion.Header>
                <Accordion.Body>
                  <p>
                    Segmentation is typically a special request originating from AmyLev Strategies. This has typically
                    been done on Meati surveys. A
                    <span style={{"color": "#0000ff"}}>
                      <Tooltip title="A special excel file found in the [DATABASE] folder of previous Meati projects." arrow>
                        &nbsp;<b>Typing Tool</b>&nbsp;
                      </Tooltip>
                    </span>
                    has been supplied for previous Meati projects and is usually copied over. There are a series of
                    questions that start labeled with an "s" on the survey, those are the questions that will be
                    copied into the typing tools box. These are typically questions coded as 1-18. A special table
                    will need to be created with columns set aside for segmentation. For the sake of ease, this has
                    been normalized as column 30 on projects where this will occur. <br/>
                    <br/>
                    The segmentation excel sheet is highly complex and should never be edited without creating a
                    backup in each project. It may sound redundant but it is easier to restore a backup from the same
                    file than having to go and find the backup elsewhere.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="10-4-2">
                <Accordion.Header>Setting up extraction</Accordion.Header>
                <Accordion.Body>
                  <p>
                    Navigate to the survey in Acuity <b>-> Analyze -> Export Responses</b> <br />
                    &ensp; Press: <b>[New] -> CSV</b> <br />
                    &ensp; Name: <b>segment</b> <br />
                    &ensp; Destination File Name: <b>segment</b> <br />
                    &ensp; Check the following: <br />
                    &emsp; <b>Export completed</b> <br />
                    &emsp; <b>Export only a subset</b> <br />
                    &ensp;&emsp; Press: <b>[Select Variables]</b> <br />
                    &ensp; Select all variables to include <br />
                    &ensp;&emsp;<b>Case ID</b><br/>
                    &ensp;&emsp;<b>Q1-Q17</b><br/>
                    &ensp; Check the following: <i>Note: these are located at the bottom</i><br />
                    &emsp; <b>Include header</b> <br />
                    &emsp; <b>Strip HTML from labels</b> <br />
                    &emsp; <b>Remove curly brackets and spaces of system variables</b><br/>
                    Once finished, click <b>[Export]</b> in the top right.<br/>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="10-4-3">
                <Accordion.Header>Typing Tool</Accordion.Header>
                <Accordion.Body>
                  <p>
                    Navigate the the <b>[DATABASE]</b> folder of any previous Meati project and copy the typing tool.<br/>
                    If not already, save it in your current project's folder with the word <b>WORKING</b> in front.<br/>
                    Open the typing tool and clear out all the numbers in the <b>RespNum</b> and <b>Q</b> columns.<br/>
                    <br/>
                    Download and save the <b>segment</b> data from your extraction task. <br/>
                    Open the segment file and the typing tool.<br/>
                    Copy and paste all the data in the <b>caseid</b> column from the segment file into the <b>RespNum</b> column in the typing tool<br/>
                    Copy all the data in <b>Q1-Q17</b> from teh segment file and pase it into the <b>Q</b> section of the typing tool.<br/>
                    <br/>
                    On the far right of the typing tool, there is a column with the following format:<br/>
                    &emsp;<b>X ALT C'000000' 30=5</b> <br/>
                    <br/>
                    Extend this line, or shrink it to end at the same row number as the <b>RespNum</b> and <b>Q</b> columns data.<br/>
                    <br/>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="10-4-4">
                <Accordion.Header>Create segmentation table</Accordion.Header>
                <Accordion.Body>
                  <p>
                    In <b>Uncle</b> type
                    <span style={{"color": "#0000ff"}}>
                      <Tooltip title="This is the table number typically used to input segment data." arrow>
                        &nbsp;<b>EDIT 602</b>&nbsp;
                      </Tooltip>
                    </span> then copy and paste all of the the rows from the far of the typing tool into this table.<br/>
                    <br/>
                    A find and replace must be done in order to properly set up the data. This can be done by pressing <b>ctrl+h</b>.<br/>
                    <i>Note: For this section, "_" will be used to denote spaces in place of " ".</i><br/>
                    <br/>
                    <b>Find: '00000</b><br/>
                    <b>Replace: '_____</b> <i>(Note: The number of underlines is the same as the number of zero's above)</i><br/>
                    <br/>
                    <b>Find: '0000</b><br/>
                    <b>Replace: '____</b><br/>
                    <br/>
                    <b>Find: '000</b><br/>
                    <b>Replace: '___</b><br/>
                    <br/>
                    <b>Find: '00</b><br/>
                    <b>Replace: '__</b><br/>
                    <br/>
                    <b>Find: '0</b><br/>
                    <b>Replace: '_</b><br/>
                    <br/>
                    upon completion, you may close the table and type <b>EXEC 602</b>.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

const styleContainer = {
  display: 'block'
}
