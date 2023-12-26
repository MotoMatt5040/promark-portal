import Accordion from 'react-bootstrap/Accordion';
import surveyDropdown from "./assets/survey_dropdown.PNG";
import surveyIdImage from './assets/survey_id.png';
import jt from './assets/j-t.png';
import TableBody from './tableBody.js'
import projTitle from "./assets/project-title-caseid.png"
import Tooltip from "@mui/material/Tooltip";
import React from 'react';

function Instructions() {
  let cleanup_instructions = "The tables output by the program aren't always in the proper finalized format for output.";
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Step 1: Create order.csv</Accordion.Header>
          <Accordion.Body>
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
              &ensp;&emsp;<b>Always indluce the following:</b><br/>
              &ensp;&emsp;&ensp;<b>Case ID</b><br/>
              &ensp;&emsp;&ensp;<b>Last Connection Date</b><br/>
              &ensp;&emsp;&ensp;<b>Start time of last connection</b><br/>
              &ensp;&emsp;&ensp;<b>Total Duration (sec.)</b><br/>
              &ensp; Check the following: <i>Note: these are located at the bottom</i><br />
              &emsp; <b>Include header</b> <br />
              &emsp; <b>Strip HTML from labels</b> <br />
              &emsp; <b>Remove curly brackets and spaces of system variables</b><br/>
              &emsp; <b>Merge multiple mention responses and open-ends</b> <br />
              Once finished, click <b>[Export]</b> in the top right.<br/>
              No further instructions for this task. Please proceed to step 2.
            </p>
          </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Step 2: Create directories</Accordion.Header>
          <Accordion.Body>
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
          </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Step 3:  Enter Survey ID and Project Number</Accordion.Header>
        <Accordion.Body>
          <p>
            Finding Survey ID: <i>Note: This can only be done while in the Surveys section.</i><br />
            &ensp; Click the dropdown in the top left corner <br />
            &emsp; <img src={surveyDropdown} alt="Survey Dropdown"/>
            &emsp; <img src={surveyIdImage} alt="Survey ID"/> <br />
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Step 4: Click Checkboxes</Accordion.Header>
        <Accordion.Body>
          <p>Uncheck the boxes for tables that will be skipped. These will include fills, computations, OS, OE, etc...</p>
        </Accordion.Body>
      </Accordion.Item>
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
      <Accordion.Item eventKey="5">
        <Accordion.Header>Step 6: Create the project<i>&nbsp;dat&nbsp;</i>file</Accordion.Header>
        <Accordion.Body>
          <p>
            Navigate to the survey in Acuity <b>-> Analyze -> Export Responses</b> (the location where you created the <b>order</b> extraction task.)<br/>
            Click the hamburger menu on the <b>order</b> extraction task. <br/>
            Click <b>copy</b><br/>
            Change the name and destination file name to <b>&lt;project number&gt;dat</b><br/>
            Uncheck <b>Merge multiple mention responses and open-ends</b><br/>
            Click <b>[Export]</b> to save the task.<br/>
            Alow the task to run until the status indicates <b>Completed</b>.<br/>
            Download the file to your projects <b>[DATABASE]</b> folder. <br/>
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="6">
        <Accordion.Header>Step 7: Run the file through USort</Accordion.Header>
        <Accordion.Body>
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
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="7">
        <Accordion.Header>Step 8: Uncle setup</Accordion.Header>
        <Accordion.Body>
          <p><i>Note: There are 2 ways to do this. Copying the project from an older file and editing the data, or creating a new file from scratch.</i></p>
          <Accordion>
            <Accordion.Item eventKey="7-1">
              <Accordion.Header>Step 1: Options</Accordion.Header>
              <Accordion.Body>
                <Accordion>
                  <Accordion.Item  eventKey="7-1-1">
                    <Accordion.Header>Copy Uncle file:&nbsp;<i>Recommended for projects with standardized tables and processes (core/os, double weights)</i></Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Navigate to a previously completed project and copy the <b>.j</b> and <b>.t</b> files from the old <b>[UNCLE]</b> folder into the new <b>[UNCLE]</b> folder.<br />
                        <img src={jt} alt="jt" /><br/>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item  eventKey="7-1-2">
                    <Accordion.Header>Create Uncle file:&nbsp;<i>Recommended for simple projects</i></Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Press <b>Windows Key</b> and type Uncle<br/>
                        Press <b>Enter</b><br/>
                        Click <b>[New Project]</b> and navigate to <b>i\PROJ\&lt;project number&gt;\DATAPROC\UNCLE</b><br/>
                        Save the uncle file as the project number.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
              <Accordion.Item eventKey="7-2">
                <Accordion.Header>Step 2: Adjust&nbsp;<b>Title</b>&nbsp;and&nbsp;<b>CaseID Position</b></Accordion.Header>
                <Accordion.Body>
                  <p>
                    Open the uncle file (<b>.j</b>) if it is not already open<br/>
                    Click <b>[Project]</b> in the middle section of the ribbon.<br/>
                    Edit the title text to the respective project name and date. <i>(Note: See screenshot below for example)</i> <br/>
                    &emsp;<b>Title:</b> &CP <b>&lt;SURVEY NAME&gt;</b> // <b>&lt;MMM&gt;</b>. <b>&lt;DD&gt;</b> - <b>&lt;DD&gt;</b>, <b>&lt;YYYY&gt;</b> &RJ PAGE &PS<br/>
                    &emsp;<b>Case ID Position:</b> Verify these are correct, even when copying.<br/>
                    &emsp;&ensp;<b>First:</b> 1<br/>
                    &emsp;&ensp;<b>Last:</b> 10<br/>
                    Click <b>OK</b><br/>
                    <img src={projTitle} alt="Project/Title" /><br/>
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            <Accordion.Item  eventKey="7-3">
              <Accordion.Header>Default Tables Scripts: (Note: All carrots must be edited &lt;&gt;)</Accordion.Header>
              <Accordion.Body>
               <TableBody />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="8">
        <Accordion.Header>Step 9: <Tooltip title={cleanup_instructions}>&nbsp;Table Cleanup</Tooltip></Accordion.Header>
        <Accordion.Body>
          <p>
            Open the <b>tables.txt</b> file in the <b>[UNCLE]</b> folder.<br/>
            Open the <b>Uncle</b> file (<b>.j</b>) if it is not already open<br/>
            While inside of the <b>tables.txt</b> file, press <b>[ctrl+a]</b> then <b>[ctrl+c]</b><br/>
            Navigate to the <b>Uncle</b> file and type <b>edit all</b>, then press <b>[ctrl+v]</b><br/>
            <br/>
            For simplicity sake, every step will begin with the same command <b>-> edit all</b>
          </p>
          <Accordion>
            <Accordion.Item eventKey="8-1">
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
                <br/>
                Some tables may require D//S scores but the output may not have added or indented them. The syntax is
                as follows:<br/>
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
              </p>
            </Accordion.Body>
          </Accordion.Item>
            <Accordion.Item eventKey="8-2">
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
            <Accordion.Item eventKey="8-3">
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
            <Accordion.Item eventKey="8-4">
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
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="9">
        <Accordion.Header>Step 10: Banner Setup</Accordion.Header>
        <Accordion.Body>
          <Accordion>
            <Accordion.Item eventKey="9-1">
              <Accordion.Header>Banner Basics</Accordion.Header>
              <Accordion.Body>
                <p>
                  Banners are part of the 900 series tables and start at 901. They will be drastically different for
                  different clients. The standard format that we use at Promark is as follows: <br/>
                  <br/>
                  <b>T
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="Centers the following title text between two table columns." arrow>
                      &nbsp;&CC
                    </Tooltip>
                  </span>2:3 GENDER&CC4:6 PARTY ID&CC7:12 PARTY ID // GENDER&CC13:15 IDEOLOGY&CC16:18 PARTY ID //
                  CONS&CC19:21 PARTY ID // MODM<br/>
                  T &CC2:3==&CC4:6==&CC7:12==&CC13:15==&CC16:18==&CC19:21==<br/>
                  <br/>
                  O FORMAT
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="row title width" arrow>
                      &nbsp;25
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="column width" arrow>
                      &nbsp;5
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="column separator" arrow>
                      &nbsp;1
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="column indentation" arrow>
                      &nbsp;0
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="ZCELL, prints the specified string ('-' in this case) in positions where the
                    frequency is zero." arrow>
                      &nbsp;ZC'-'
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="ZPCELL, prints the specified string ('-' in this case) in positions where the
                    percentage is zero." arrow>
                      &nbsp;ZPC'-'
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="Used to print the percent sign after each percentage." arrow>
                      &nbsp;PCTS
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="PDP controls the number of decimal printed for percentages (0 in this case)." arrow>
                      &nbsp;PDP0
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="HBASE specifies that the frequencies of an indicated column will be used as the
                    base for horizontal percentages (in this case 1)." arrow>
                      &nbsp;HB1&nbsp;
                    </Tooltip>
                  </span><br/>
                  <br/>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="Column identifier" arrow>
                      C&nbsp;
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="Centers the following title text between two print positions." arrow>
                      &CE&nbsp;
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="Column title" arrow>
                      TOTAL&nbsp;
                    </Tooltip>
                  </span>
                  <span style={{"color": "#0000ff"}}>
                    <Tooltip title="Column position" arrow>
                      ;ALL&nbsp;
                    </Tooltip>
                  </span>
                  </b>
                  <br/>
                  Individual columns can be adjusted using the
                  <b>
                    <span style={{"color": "#0000ff"}}>
                      <Tooltip title="e.g. ;COLW6, ;COLW7, ;COLW8" arrow>
                        &nbsp;;COLW#&nbsp;
                      </Tooltip>
                    </span>
                  </b>
                  <br/>
                  <br/>
                  Some clients will want the company name to be printed on the bottom of each banner page, to include
                  it, use the following syntax at the bottom of the page:
                  <b>
                    &nbsp;F
                    <span style={{"color": "#0000ff"}}>
                      <Tooltip title="Centers the following title text between two print positions." arrow>
                        &nbsp;&#38;CP;&nbsp;
                      </Tooltip>
                    </span>
                    &lt; C O M P A N Y  N A M E &gt;
                  </b>
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="9-2">
              <Accordion.Header>Example Table 1:</Accordion.Header>
              <Accordion.Body>
                <pre>
                  *
                  <br/>TABLE 901
                  <br/>T / / BANNER 1
                  <br/>T &CC2:3 GENDER&CC4:6 PARTY ID&CC7:12 PARTY ID // GENDER&CC13:15 IDEOLOGY&CC16:18 PARTY ID // CONS&CC19:21 PARTY ID // MOD
                  <br/>T &CC2:3==&CC4:6==&CC7:12==&CC13:15==&CC16:18==&CC19:21==
                  <br/>O FORMAT 25 5 1 0 ZC'-' ZPC'-' PCTS PDP0 HB1
                  <br/>C &CE TOTAL     ;ALL
                  <br/>C &CE MEN       ;36-1
                  <br/>C &CE WOMEN     ;36-2
                  <br/>C &CE REP       ;37-1:3
                  <br/>C &CE IND       ;37-4
                  <br/>C &CE DEM       ;37-5:7
                  <br/>C &CE REP/MEN   ;36-1 37-1:3
                  <br/>C &CE REP/WOMEN ;36-2 37-1:3
                  <br/>C &CE IND/MEN   ;36-1 37-4
                  <br/>C &CE IND/WOMEN ;36-2 37-4
                  <br/>C &CE DEM/MEN   ;36-1 37-5:7
                  <br/>C &CE DEM/WOMEN ;36-2 37-5:7
                  <br/>C &CE CONS      ;51-1:2
                  <br/>C &CE MOD       ;51-3
                  <br/>C &CE LIB       ;51-4:5
                  <br/>C &CE REP/CONS  ;51-1:2 37-1:3
                  <br/>C &CE IND/CONS  ;51-1:2 37-4
                  <br/>C &CE DEM/CONS  ;51-1:2 37-5:7
                  <br/>C &CE REP/MOD   ;51-3 37-1:3
                  <br/>C &CE IND/MOD   ;51-3 37-4
                  <br/>C &CE DEM/MOD   ;51-3 37-5:7
                </pre>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="9-3">
              <Accordion.Header>Example Table 2:</Accordion.Header>
              <Accordion.Body>
                <pre>
                  *
                  <br/>TABLE 902
                  <br/>T / / BANNER 2
                  <br/>T &CC2:7 AGE&CC8:12 RACE&CC13:16 INCOME&CC17:19 AREA&CC20:23 REGION
                  <br/>T &CC2:7==&CC8:12==&CC13:16==&CC17:19==&CC20:23==
                  <br/>O FORMAT 25 5 1 0 ZC'-' ZPC'-' PCTS PDP0 HB1
                  <br/>C &CE TOTAL       ;ALL
                  <br/>C &CE 18-24       ;35-1
                  <br/>C &CE 25-34       ;35-2
                  <br/>C &CE 35-44       ;35-3
                  <br/>C &CE 45-54       ;35-4
                  <br/>C &CE 55-64       ;35-5
                  <br/>C &CE 65+         ;35-6
                  <br/>C &CE WHITE       ;39-1 38N1
                  <br/>C &CE BLACK       ;39-2 38N1
                  <br/>C &CE ASIAN       ;39-3 38N1
                  <br/>C &CE HISP        ;39-4 OR 38-1
                  <br/>C &CE OTHER       ;39-5:6 38N1
                  <br/>C &CE &lt;$40K       ;48-1
                  <br/>C &CE $40K-/$80K  ;48-2
                  <br/>C &CE $80K-/$125K ;48-3
                  <br/>C &CE &gt;$125K      ;48-4 ;COLW6
                  <br/>C &CE URBAN       ;50-1
                  <br/>C &CE SUBURB      ;50-2 ;COLW6
                  <br/>C &CE RURAL       ;50-3
                  <br/>C &CE NE          ;32-1
                  <br/>C &CE MW          ;32-2
                  <br/>C &CE SOUTH       ;32-3
                  <br/>C &CE WEST        ;32-4
                </pre>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default Instructions;