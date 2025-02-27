import axios from "../../../api/axios";
import * as XLSX from 'xlsx';

export const getSurveyName = async (
    source,
    surveyID,
    setSurveyName,
    setSurveyIDError,
) => {
  try {
    const response = await axios.post('/quotas/survey_name', { source, surveyID }, {
      headers: { 'Content-Type': 'application/json', 'X-Csrftoken': localStorage.getItem('csrftoken') }
    });
    console.log(response.data)
    setSurveyName('testing');
  } catch (error) {
    console.error("Error fetching survey name", error);
    setSurveyName(`Invalid ${source} Survey ID`);
    setSurveyIDError(true);
  }
};

export const setAllIDs = async (
    source,
    surveyID
) => {
    try {
    const response = await axios.post('/quotas/surveyIDs', { source, surveyID }, {
      headers: { 'Content-Type': 'application/json', 'X-Csrftoken': localStorage.getItem('csrftoken') }
    });
    console.log(response.data)
  } catch (error) {
    console.error("Error fetching survey name", error);
  }
}

export const getSurveyQuotas = async (source) => {
  try {
    const response = await axios.post('/quotas/survey_quotas', { source }, {
      headers: { 'Content-Type': 'application/json', 'X-Csrftoken': localStorage.getItem('csrftoken') }
    });
  } catch (error) {
    console.error("Error fetching survey quotas", error);
  }
};

export const handleErrors = (error) => {
  if (!error?.response) {
    console.error('No Server Response');
  } else if (error.response.status === 401) {
    console.error('Invalid Credentials');
  } else {
    console.error('Request Failed');
  }
};

export const downloadExcel = (data, showColumns, surveyName) => {
  // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Headers
    let header1 = ["Criterion", "Label", "Obj", "Freq", "ToDo", "DONE%"];
    if (showColumns.web) {
    header1.push("Web Total%");
    if (showColumns.panel) {
        header1.push("Panel Objective");
        header1.push("Panel Frequency");
        header1.push("Panel%");
    }
    if (showColumns.t2w){
        header1.push("T2W Objective");
        header1.push("T2W Frequency");
        header1.push("T2W%");
    }
    }
    if (showColumns.phone) {
    header1.push("Phone Total %");
    if (showColumns.landline){
        header1.push("Landline Objective");
        header1.push("Landline Frequency");
        header1.push("Landline%");
    if (showColumns.cell) {
        header1.push("Cell Objective");
        header1.push("Cell Frequency");
        header1.push("Cell%");}
    }
    }

    // Add headers to the worksheet
    XLSX.utils.sheet_add_aoa(ws, [header1], { origin: "A1" });

    // Add data to the worksheet
    Object.keys(data.Criterion).forEach((key, index) => {
    let row = [
        data.Criterion[index],
        data['COM Label'][index],
        data['COM Objective'][index],
        data['COM Frequency'][index],
        data['COM To Do'][index],
        data['G%'][index] + "%"
    ];

    if (showColumns.web) {
        row.push(data['W%'][index] + "%");
        if (showColumns.panel) {
        row.push(data['Panel Objective'][index]);
        row.push(data['Panel Frequency'][index]);
        row.push(data['P%'][index] + "%");
        }
        if (showColumns.t2w) {
        row.push(data['T2W Objective'][index]);
        row.push(data['T2W Frequency'][index]);
        row.push(data['T%'][index] + "%");
        }
    }
    if (showColumns.phone) {
        row.push(data['Phone%'][index] + "%");
        if (showColumns.landline) {
        row.push(data['LL Objective'][index]);
        row.push(data['LL Frequency'][index]);
        row.push(data['L%'][index] + "%");
        }
        if (showColumns.cell) {
        row.push(data['Cell Objective'][index]);
        row.push(data['Cell Frequency'][index]);
        row.push(data['C%'][index] + "%");
        }
    }

    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
    });

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");

    // Generate and download the Excel file
    const survey_n = surveyName.split(' ')[0];
    XLSX.writeFile(wb, `${survey_n} Quotas.xlsx`);
};