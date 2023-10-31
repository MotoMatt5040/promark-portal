export default function TableBody() {
  return (

    <p>
      *
      <br/>TABLE 900
      <br/>T / / BANNER 0
      <br/>O FORMAT 25 6 1 0 ZC'-' ZPC'-' PCTS PDP0 HB1
      <br/>C &CE TOTAL  ;ALL
      <br/>F &CP <b>&lt; C O M P A N Y&emsp;L O G O &gt;</b>
      <br/>*
      <br/>TABLE 992
      <br/>T RUN STREAM FOR CHECKING STUBS
      <br/>X SET MONITOR STAT
      <br/>X SET QUAL OFF
      <br/>X SET WIDTH 255
      <br/>X SET PLINE 175
      <br/>X SET PAGE 75
      <br/>X SET WRAP 150
      <br/>X SET TITLE '/&CP TEST STUBS - RUN DATE:  <b>&lt;MMM&gt;</b>. <b>&lt;DD&gt;</b>, <b>&lt;YYYY&gt;</b>'
      <br/>X SET OUTPUT RESPONSE REQUEST FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>ST.LOG'
      <br/>X SET OUTPUT OFF FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>ST.TAB'
      <br/>X RUN <b>&lt;FIRST&gt;</b> TH <b>&lt;LAST&gt;</b> B 900 OFF PAGE 1
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>ST.TAB'
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>ST.LOG'
      <br/>X SET TITLE ''
      <br/>X SET QUAL OFF
      <br/>*
      <br/>TABLE 993
      <br/>T RUN STREAM FOR CHECKING BANNERS
      <br/>X SET MONITOR STAT
      <br/>X SET WIDTH 255
      <br/>X SET PLINE 175
      <br/>X SET PAGE 75
      <br/>X SET WRAP 150
      <br/>X SET QUAL OFF
      <br/>X SET OUTPUT RESPONSE REQUEST FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>TT.LOG'
      <br/>X SET OUTPUT OFF FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>TT.TAB'
      <br/>X SET TITLE '/&CP NATIONAL CORE DATA ONLY'
      <br/>X ^SET TITLE '/&CP TEST BANNER 1 / PARTIAL DATA / RUN DATE: <b>&lt;MMM&gt;</b>. <b>&lt;DD&gt;</b>, <b>&lt;YYYY&gt;</b>'
      <br/>X RUN <b>&lt;tables&gt;</b> B 901 OFF PAGE 1
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>TT.TAB'
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>TT.LOG'
      <br/>X SET TITLE ''
      <br/>X SET QUAL OFF
      <br/>*
      <br/>TABLE 998
      <br/>T RUN STREAM FOR TABLES
      <br/>X SET MONITOR STAT
      <br/>X SET QUAL OFF
      <br/>X SET WIDTH 255
      <br/>X SET PLINE 175
      <br/>X SET PAGE 75
      <br/>X SET WRAP 150
      <br/>X SET OUTPUT RESPONSE REQUEST FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>FT.LOG'
      <br/>X SET OUTPUT OFF FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>FT.TAB'
      <br/>X RUN <b>&lt;FIRST&gt;</b> TH <b>&lt;LAST&gt;</b> B 901 OFF PAGE 1
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>FT.TAB'
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT/<b>&lt;PROJECT ID&gt;</b>FT.LOG'
      <br/>X SET TITLE ''
      <br/>X SET QUAL OFF
      <br/>*
      <br/>TABLE 777
      <br/>T RUN STREAM FOR WEIGHTING
      <br/>X SET QUAL OFF
      <br/>X WEIGHT UNWEIGHT
      <br/>X SET MONITOR STAT
      <br/>X SET PLINE 80
      <br/>X SET PAGE 96
      <br/>X SET TITLE ''
      <br/>X SET OUTPUT RESPONSE REQUEST FILE 'OUTPUT\<b>&lt;PROJECT ID&gt;</b>WGHT.LOG'
      <br/>X SET OUTPUT OFF FILE 'OUTPUT\<b>&lt;PROJECT ID&gt;</b>WGHT'
      <br/>X ^WEIGHT 700 FREQ
      <br/>X ^SET QUAL (ALL)
      <br/>X WEIGHT 701 702 703 704 705 706 707
      <br/>X SET QUAL OFF
      <br/>X SET TITLE '&CP WEIGHTING REPORT'
      <br/>X RUN 1000 B 911 OFF PAGE 1
      <br/>X SET TITLE ''
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT\<b>&lt;PROJECT ID&gt;</b>WGHT'
      <br/>X SET OUTPUT CLOSE FILE 'OUTPUT\<b>&lt;PROJECT ID&gt;</b>WGHT.LOG'
      <br/>X SET QUAL OFF
      <br/>*
      <br/>TABLE 911
      <br/>T / / BANNER 911
      <br/>T &CC1:3 UNWEIGHTED&CC4:6 WEIGHTED
      <br/>T &CC1:3==&CC4:6==
      <br/>O FORMAT 20 10 5 0 ZC'-' ZPC'-' PCTS PDP2
      <br/>C TOTAL     ;ALL  ;NOWEIGHT
      <br/>C VERSION A ;<b>&lt;COL&gt;</b>-1 ;NOWEIGHT
      <br/>C VERSION B ;<b>&lt;COL&gt;</b>-2 ;NOWEIGHT
      <br/>C TOTAL     ;ALL
      <br/>C VERSION A ;<b>&lt;COL&gt;</b>-1
      <br/>C VERSION B ;<b>&lt;COL&gt;</b>-2
      <br/>*
      <br/>TABLE 1000
      <br/>T *** FOR CHECKING WEIGHTING
      <br/>R BASE==TOTAL SAMPLE                ;ALL    ;HP NOVP
      <br/>R &UT- GENDER                       ;NONE   ;NOVP NOHP NOFREQ
      <br/>R &AI2 MEN                          ;<b>&lt;COL&gt;</b>-1
      <br/>R &AI2 WOMEN                        ;<b>&lt;COL&gt;</b>-2
      <br/>R &AI2 NON-BINARY                   ;<b>&lt;COL&gt;</b>-3   ;SZR
      <br/>R &UT- AGE                          ;NONE   ;NOVP NOHP NOFREQ
      <br/>R &AI2 18-34                        ;<b>&lt;COL&gt;</b>-1:2
      <br/>R &AI2 35-44                        ;<b>&lt;COL&gt;</b>-3
      <br/>R &AI2 45-54                        ;<b>&lt;COL&gt;</b>-4
      <br/>R &AI2 55-64                        ;<b>&lt;COL&gt;</b>-5
      <br/>R &AI2 65+                          ;<b>&lt;COL&gt;</b>-6
      <br/>R &AI2 REFUSED                      ;<b>&lt;COL&gt;</b>-7   ;SZR
      <br/>R &UT- RACE                         ;NONE   ;NOVP NOHP NOFREQ
      <br/>R &AI2 WHITE                        ;<b>&lt;COL&gt;</b>-1
      <br/>R &AI2 HISPANIC                     ;<b>&lt;COL&gt;</b>-2
      <br/>R &AI2 BALANCE                      ;73N1:2 ;SZR
      <br/>R &UT- DMA                          ;NONE   ;NOVP NOHP NOFREQ PAGINATE 9
      <br/>R &AI2 AMARILLO                     ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 FT SMITH-/FAYETTEVILLE       ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 JOPLIN-PITTSBURG             ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 OKLAHOMA CITY                ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 SHERMAN-ADA                  ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 SHREVEPORT                   ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 TULSA                        ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 WICHITA FALLS-LAWTON         ;<b>;COL></b>
      <br/>R &UT- COUNTY &gt; 10                  ;NONE   ;NOVP NOHP NOFREQ PAGINATE 8
      <br/>R &AI2 OKLAHOMA                     ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 TULSA                        ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 CLEVELAND                    ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 CANADIAN                     ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 COMANCHE                     ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 ROGERS                       ;<b>&lt;COL&gt;</b>
      <br/>R &AI2 COUNTY &lt; 10                  ;<b>&lt;COL&gt;</b>
      <br/>R &UT- PARTY                        ;NONE   ;NOVP NOHP NOFREQ PAGINATE 5
      <br/>R &AI2 GOP                          ;<b>&lt;COL&gt;</b>-1:2
      <br/>R &AI2 IND                          ;<b>&lt;COL&gt;</b>-3:5
      <br/>R &AI2 DEM                          ;<b>&lt;COL&gt;</b>-6:7
      <br/>R &AI2 OTH                          ;<b>&lt;COL&gt;</b>-8:9
      <br/>R &UT- EDUCATION                    ;NONE   ;NOVP NOHP NOFREQ PAGINATE 8
      <br/>R &AI2 HIGH SCHOOL GRADUATE OR LESS ;<b>&lt;COL&gt;</b>-1
      <br/>R &AI2 TECHNICAL//VOCATIONAL SCHOOL ;<b>&lt;COL&gt;</b>-2
      <br/>R &AI2 SOME COLLEGE                 ;<b>&lt;COL&gt;</b>-3
      <br/>R &AI2 COLLEGE GRAD                 ;<b>&lt;COL&gt;</b>-4
      <br/>R &AI2 POST GRAD                    ;<b>&lt;COL&gt;</b>-5
      <br/>R &AI2 DON'T KNOW                   ;<b>&lt;COL&gt;</b>-6   ;SZR
      <br/>R &AI2 REFUSED                      ;<b>&lt;COL&gt;</b>-7   ;SZR
      <br/> *
      <br/>TABLE 9205
      <br/>X RUN <b>&lt;FIRST&gt;</b> TH <b>&lt;LAST&gt;</b> B 9001 EXCEL (FILE'<b>&lt;PROJECT ID&gt;</b>TABS' SHEET 'ALL' REPLACE TN 'Table: &t-&q' COMBINE TC NOMERGE NMRT) TCONE
      <br/>*
      <br/>TABLE 9001
      <br/>T &CC2:4 PARTY ID&CC5:7 IDEOLOGY
      <br/>T &CC2:4==&CC5:7==
      <br/>O FORMAT 25 5 1 0 ZPACELL'--' ZC'-' ZPC'*' PCTS PDP0 HB1
      <br/>C &CE TOTAL      ;ALL     ;NOFREQ
      <br/>C &CE REP        ;<b>&lt;COL&gt;</b>-1:2  ;NOFREQ
      <br/>C &CE IND        ;<b>&lt;COL&gt;</b>-3:5  ;NOFREQ
      <br/>C &CE DEM        ;<b>&lt;COL&gt;</b>-6:7  ;NOFREQ
      <br/>C &CE CONS       ;<b>&lt;COL&gt;</b>-1:2  ;NOFREQ
      <br/>C &CE MOD        ;<b>&lt;COL&gt;</b>-3    ;NOFREQ
      <br/>C &CE LIB        ;<b>&lt;COL&gt;</b>-4:5  ;NOFREQ
    </p>
  )
}
