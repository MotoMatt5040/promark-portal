import React, { useState } from "react";

export default function Sidebar({ handleSelection}) {

  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    console.log("clicked", section)
    setActiveSection(section);
    handleSelection(section)
    // window.location.href='data_processing/'+ section;
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
            <li className={activeSection === "create-order" ? "step 1 --active" : "step 1"} onClick={() => handleSectionClick("create-order")}>Step 1: Create order.csv</li>
            <li className={activeSection === "create-directories" ? "step 2 --active" : "step 2"} onClick={() => handleSectionClick("create-directories")}>Step 2: Create directories</li>
            <li className={activeSection === "enter-survey-id" ? "step 3 --active" : "step 3"} onClick={() => handleSectionClick("enter-survey-id")}>Step 3: Enter Survey ID</li>
            <li className={activeSection === "click-checkboxes" ? "step 4 --active" : "step 4"} onClick={() => handleSectionClick("click-checkboxes")}>Step 4: Click Checkboxes</li>
            <li className={activeSection === "click-download" ? "step 5 --active" : "step 5"} onClick={() => handleSectionClick("click-download")}>Step 5: Click Download</li>
            <li className={activeSection === "create-project" ? "step 6 --active" : "step 6"} onClick={() => handleSectionClick("create-project")}>Step 6: Create the project</li>
            <li className={activeSection === "run-usort" ? "step 7 --active" : "step 7"} onClick={() => handleSectionClick("run-usort")}>Step 7: Run the file through USort</li>
            <li className={activeSection === "uncle-setup" ? "step 8 --active" : "step 8"} onClick={() => handleSectionClick("uncle-setup")}>
              Step 8: Uncle Setup
              <ul>
                <li className={activeSection === "uncle-setup/options" ? "step 8-1 --active" : "step 8-1"} onClick={(event) => handleNestedSectionClick("uncle-setup/options", event)}>
                  Step 1: Options
                  <ul>
                    <li className={activeSection === "uncle-setup/options/copy" ? "step 8-1-1 --active" : "step 8-1-1"} onClick={(event) => handleNestedSectionClick("uncle-setup/options/copy", event)}>Copy Uncle File</li>
                    <li className={activeSection === "uncle-setup/options/create" ? "step 8-1-2 --active" : "step 8-1-2"} onClick={(event) => handleNestedSectionClick("uncle-setup/options/create", event)}>Create Uncle File</li>
                  </ul>
                </li>
                <li className={activeSection === "uncle-setup/adjust" ? "step 8-2 --active" : "step 8-2"} onClick={(event) => handleNestedSectionClick("uncle-setup/adjust", event)}>Step 2: Adjust <b>Title</b> and <b>CaseID Position</b></li>
                <li className={activeSection === "uncle-setup/default-table-scripts" ? "step 8-3 --active" : "step 8-3"} onClick={(event) => handleNestedSectionClick("uncle-setup/default-table-scripts", event)}>Default Table Scripts</li>
              </ul>
            </li>
            <li className={activeSection === "table-cleanup" ? "step 9 --active" : "step 9"} onClick={() => handleSectionClick("table-cleanup")}>
              Step 9: Table Cleanup
              <ul>
                <li className={activeSection === "table-cleanup/indentations" ? "step 9-1 --active" : "step 9-1"} onClick={(event) => handleNestedSectionClick("table-cleanup/indentations", event)}>Fixing Indentations and D//S scores</li>
                <li className={activeSection === "table-cleanup/no-answer" ? "step 9-2 --active" : "step 9-2"} onClick={(event) => handleNestedSectionClick("table-cleanup/no-answer", event)}>Fixing No Answer codes</li>
                <li className={activeSection === "table-cleanup/qualifiers" ? "step 9-3 --active" : "step 9-3"} onClick={(event) => handleNestedSectionClick("table-cleanup/qualifiers", event)}>Fixing Qualifiers</li>
                <li className={activeSection === "table-cleanup/ranks" ? "step 9-4 --active" : "step 9-4"} onClick={(event) => handleNestedSectionClick("table-cleanup/ranks", event)}>Identifying Ranks</li>
              </ul>
            </li>
            <li className={activeSection === "stub-checking" ? "step 10 --active" : "step 10"} onClick={() => handleSectionClick("stub-checking")}>
              Step 10: Stub Checking
              <ul>
                <li className={activeSection === "stub-checking/table-order" ? "step 10-1 --active" : "step 10-1"} onClick={(event) => handleNestedSectionClick("stub-checking/table-order", event)}>Check table order</li>
                <li className={activeSection === "stub-checking/qualifiers" ? "step 10-2 --active" : "step 10-2"} onClick={(event) => handleNestedSectionClick("stub-checking/qualifiers", event)}>Check qualifiers</li>
                <li className={activeSection === "stub-checking/verify-numbers" ? "step 10-3 --active" : "step 10-3"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers", event)}>
                  Verify numbers add up
                  <ul>
                    <li className={activeSection === "stub-checking/verify-numbers/basic-tables" ? "step 10-3-1 --active" : "step 10-3-1"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers/basic-tables", event)}>Basic Tables</li>
                    <li className={activeSection === "stub-checking/verify-numbers/total-tables" ? "step 10-3-2 --active" : "step 10-3-2"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers/total-tables", event)}>Total Tables</li>
                    <li className={activeSection === "stub-checking/verify-numbers/multi-choice-tables" ? "step 10-3-3 --active" : "step 10-3-3"} onClick={(event) => handleNestedSectionClick("stub-checking/verify-numbers/multi-choice-tables", event)}>Multi-Choice Tables</li>
                  </ul>
                </li>
                <li className={activeSection === "stub-checking/segmentation" ? "step 10-4 --active" : "step 10-4"} onClick={() => handleSectionClick("change")}>
                  Segmentation
                  <ul>
                    <li className={activeSection === "stub-checking/segmentation/help" ? "step 10-4-1 --active" : "step 10-4-1"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/help", event)}>What is segmentation?</li>
                    <li className={activeSection === "stub-checking/segmentation/extraction" ? "step 10-4-2 --active" : "step 10-4-2"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/extraction", event)}>Setting up extraction</li>
                    <li className={activeSection === "stub-checking/segmentation/typing-tool" ? "step 10-4-3 --active" : "step 10-4-3"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/typing-tool", event)}>Typing Tool</li>
                    <li className={activeSection === "stub-checking/segmentation/create-table" ? "step 10-4-4 --active" : "step 10-4-4"} onClick={(event) => handleNestedSectionClick("stub-checking/segmentation/create-table", event)}>Create segmentation table</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className={activeSection === "banner-setup" ? "step 11 --active" : "step 11"} onClick={() => handleSectionClick("banner-setup")}>
              Step 11: Banner Setup
              <ul>
                <li className={activeSection === "banner-setup/basics" ? "step 11-1 --active" : "step 11-1"} onClick={(event) => handleNestedSectionClick("banner-setup/basics", event)}>Banner Basics</li>
                <li className={activeSection === "banner-setup/example-1" ? "step 11-2 --active" : "step 11-2"} onClick={(event) => handleNestedSectionClick("banner-setup/example-1", event)}>Example Table 1</li>
                <li className={activeSection === "banner-setup/example-2" ? "step 11-3 --active" : "step 11-3"} onClick={(event) => handleNestedSectionClick("banner-setup/example-2", event)}>Example Table 2</li>
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