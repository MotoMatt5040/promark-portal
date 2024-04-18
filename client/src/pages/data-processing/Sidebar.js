import React, { useState } from "react";
import "./index.css";


export default function Sidebar({ handleSelection}) {

  const [activeSection, setActiveSection] = useState(null);
  const [checklistStatus, setChecklistStatus] = useState();

  const handleSectionClick = (section) => {
    console.log("clicked", section)
    console.log(activeSection)
    setActiveSection(section);
    handleSelection(section)
  };

  const handleNestedSectionClick = (section, event) => {
    event.stopPropagation(); // Stop event propagation to parent
    handleSectionClick(section);
  };

  return (
    <div style={{borderRight: "1px solid grey", paddingRight: "1%"}}>
      <aside className='sidebar'>
        <nav style={sidebarStyle}>
          <ul>
            <li><div className={activeSection === "create-order" ? "step 1 --active" : "step 1"} onClick={() => handleSectionClick("create-order")}>Step 1: Create order.csv</div></li>
            <li><div className={activeSection === "create-directories" ? "step 2 --active" : "step 2"} onClick={() => handleSectionClick("create-directories")}>Step 2: Create directories</div></li>
            <li><div className={activeSection === "enter-survey-id" ? "step 3 --active" : "step 3"} onClick={() => handleSectionClick("enter-survey-id")}>Step 3: Enter Survey ID</div></li>
            <li><div className={activeSection === "click-checkboxes" ? "step 4 --active" : "step 4"} onClick={() => handleSectionClick("click-checkboxes")}>Step 4: Click Checkboxes</div></li>
            <li><div className={activeSection === "click-download" ? "step 5 --active" : "step 5"} onClick={() => handleSectionClick("click-download")}>Step 5: Click Download</div></li>
            <li><div className={activeSection === "create-project" ? "step 6 --active" : "step 6"} onClick={() => handleSectionClick("create-project")}>Step 6: Create the project</div></li>
            <li><div className={activeSection === "run-usort" ? "step 7 --active" : "step 7"} onClick={() => handleSectionClick("run-usort")}>Step 7: Run the file through USort</div></li>
            <li>
              <div className={activeSection === "uncle-setup" ? "step 8 --active" : "step 8"} onClick={() => handleSectionClick("uncle-setup")}>Step 8: Uncle Setup</div>
              <ul>
                <li>
                  <div className={activeSection === "uncle-setup/options" ? "step 8-1 --active" : "step 8-1"} onClick={(event) => handleNestedSectionClick("uncle-setup/options", event)}>Step 1: Options</div>
                  <ul>
                    <li><div className={activeSection === "uncle-setup/options/copy" ? "step 8-1-1 --active" : "step 8-1-1"} onClick={(event) => handleNestedSectionClick("uncle-setup/options/copy", event)}>Copy Uncle File</div></li>
                    <li><div className={activeSection === "uncle-setup/options/create" ? "step 8-1-2 --active" : "step 8-1-2"} onClick={(event) => handleNestedSectionClick("uncle-setup/options/create", event)}>Create Uncle File</div></li>
                  </ul>
                </li>
                <li><div className={activeSection === "uncle-setup/adjust" ? "step 8-2 --active" : "step 8-2"} onClick={(event) => handleNestedSectionClick("uncle-setup/adjust", event)}>Step 2: Adjust <b>Title</b> and <b>CaseID Position</b></div></li>
                <li><div className={activeSection === "uncle-setup/default-table-scripts" ? "step 8-3 --active" : "step 8-3"} onClick={(event) => handleNestedSectionClick("uncle-setup/default-table-scripts", event)}>Default Table Scripts</div></li>
              </ul>
            </li>
            <li>
              <div className={activeSection === "table-cleanup" ? "step 9 --active" : "step 9"} onClick={() => handleSectionClick("table-cleanup")}>Step 9: Table Cleanup</div>
              <ul>
                <li><div className={activeSection === "table-cleanup/indentations" ? "step 9-1 --active" : "step 9-1"} onClick={(event) => handleNestedSectionClick("table-cleanup/indentations", event)}>Fixing Indentations and D//S scores</div></li>
                <li><div className={activeSection === "table-cleanup/no-answer" ? "step 9-2 --active" : "step 9-2"} onClick={(event) => handleNestedSectionClick("table-cleanup/no-answer", event)}>Fixing No Answer codes</div></li>
                <li><div className={activeSection === "table-cleanup/qualifiers" ? "step 9-3 --active" : "step 9-3"} onClick={(event) => handleNestedSectionClick("table-cleanup/qualifiers", event)}>Fixing Qualifiers</div></li>
                <li><div className={activeSection === "table-cleanup/ranks" ? "step 9-4 --active" : "step 9-4"} onClick={(event) => handleNestedSectionClick("table-cleanup/ranks", event)}>Identifying Ranks</div></li>
              </ul>
            </li>
            <li>
              <div className={activeSection === "stub-checking" ? "step 10 --active" : "step 10"} onClick={() => handleSectionClick("stub-checking")}>Step 10: Stub Checking</div>
              <ul>
                <li><div className={activeSection === "stub-checking/table-order" ? "step 10-1 --active" : "step 10-1"} onClick={(event) => handleNestedSectionClick("stub-checking/table-order", event)}>Check table order</div></li>
                <li><div className={activeSection === "stub-checking/qualifiers" ? "step 10-2 --active" : "step 10-2"} onClick={(event) => handleNestedSectionClick("stub-checking/qualifiers", event)}>Check qualifiers</div></li>
                <li>
                  <div className={activeSection === "stub-checking/verify-numbers" ? "step 10-3 --active" : "step 10-3"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers", event)}>Verify numbers add up</div>
                  <ul>
                    <li><div className={activeSection === "stub-checking/verify-numbers/basic-tables" ? "step 10-3-1 --active" : "step 10-3-1"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers/basic-tables", event)}>Basic Tables</div></li>
                    <li><div className={activeSection === "stub-checking/verify-numbers/total-tables" ? "step 10-3-2 --active" : "step 10-3-2"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers/total-tables", event)}>Total Tables</div></li>
                    <li><div className={activeSection === "stub-checking/verify-numbers/multi-choice-tables" ? "step 10-3-3 --active" : "step 10-3-3"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers/multi-choice-tables", event)}>Multi-Choice Tables</div></li>
                  </ul>
                </li>
                <li>
                  <div className={activeSection === "stub-checking/segmentation" ? "step 10-4 --active" : "step 10-4"} onClick={() => handleSectionClick("stub-checking/segmentation")}>Segmentation</div>
                  <ul>
                    <li><div className={activeSection === "stub-checking/segmentation/help" ? "step 10-4-1 --active" : "step 10-4-1"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/help", event)}>What is segmentation?</div></li>
                    <li><div className={activeSection === "stub-checking/segmentation/extraction" ? "step 10-4-2 --active" : "step 10-4-2"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/extraction", event)}>Setting up extraction</div></li>
                    <li><div className={activeSection === "stub-checking/segmentation/typing-tool" ? "step 10-4-3 --active" : "step 10-4-3"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/typing-tool", event)}>Typing Tool</div></li>
                    <li><div className={activeSection === "stub-checking/segmentation/create-table" ? "step 10-4-4 --active" : "step 10-4-4"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/create-table", event)}>Create segmentation table</div></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <div className={activeSection === "banner-setup" ? "step 11 --active" : "step 11"} onClick={() => handleSectionClick("banner-setup")}>Step 11: Banner Setup</div>
              <ul>
                <li><div className={activeSection === "banner-setup/basics" ? "step 11-1 --active" : "step 11-1"} onClick={(event) => handleNestedSectionClick("banner-setup/basics", event)}>Banner Basics</div></li>
                <li><div className={activeSection === "banner-setup/example-1" ? "step 11-2 --active" : "step 11-2"} onClick={(event) => handleNestedSectionClick("banner-setup/example-1", event)}>Example Table 1</div></li>
                <li><div className={activeSection === "banner-setup/example-2" ? "step 11-3 --active" : "step 11-3"} onClick={(event) => handleNestedSectionClick("banner-setup/example-2", event)}>Example Table 2</div></li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  )
}

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100%',
}