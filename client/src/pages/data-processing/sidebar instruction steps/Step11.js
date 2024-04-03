import Accordion from "react-bootstrap/Accordion";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export default function Step11({ defaultActiveKeys}) {
  return (
    <div style={styleContainer}>
      <h1>Step 11: Banner Setup</h1>
      <Accordion defaultActiveKey={defaultActiveKeys && defaultActiveKeys.parent} flush>
        <Accordion.Item eventKey="11-1">
          <Accordion.Header>Banner Basics</Accordion.Header>
          <Accordion.Body>
            <p>
              Banners are part of the 900 series tables and start at 901. They will be drastically different for
              different clients. Banners are typically sent from clients in the form of an excel file. They will
              have numbers on the side that correspond to the column position on the table. These numbers are
              typically 1-24, where 24 is the last column and cannot be exceeded without modification to the output
              file. In the case where you need to exceed 24 columns, it is recommended to verify the fitment on the
              output file, and adjust the output file text size as needed. A font size of 7.5 will typically allow
              one extra column to fit on the page, but you must verify that the margins are even for a nice looking
              form factor. The standard format that we use at Promark is as follows: <br/>
              <br/>
              <b>T
              <span style={{"color": "#0000ff"}}>
                <Tooltip title="Centers the following title text between two table columns." arrow>
                  &nbsp;&CC
                </Tooltip>
              </span>2:3 GENDER&CC4:6 PARTY ID&CC7:12 PARTY ID // GENDER&CC13:15 IDEOLOGY&CC16:18 PARTY ID //
              CONS&CC19:21 PARTY ID // MOD<br/>
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
        <Accordion.Item eventKey="11-2">
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
        <Accordion.Item eventKey="11-3">
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
    </div>
  )
}

const styleContainer = {
  display: 'block'
}
