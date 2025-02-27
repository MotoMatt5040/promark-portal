import React, { useEffect, useState } from 'react';
import axios from "../../api/axios";
import Button from '@mui/material/Button';
import SurveyForm from './components/SurveyForm';
import QuotaTable from './components/QuotaTable';
import { getSurveyName, getSurveyQuotas, handleErrors, downloadExcel, setAllIDs } from './utils/quotaUtils';
import './styles.css';
import Cookies from "js-cookie";
import Table from 'react-bootstrap/Table';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': Cookies.get("csrf_token")
  }
};

function Quotas() {
  const [promarkSurveyID, setPromarkSurveyID] = useState();
  const [promarkSurveyName, setPromarkSurveyName] = useState('Survey ID');
  const [isPromarkSurveyIDError, setPromarkSurveyIDError] = useState(false);

  const [data, setData] = useState({});

  const [showColumns, setShowColumns] = useState({
    web: true,
    phone: true,
    panel: true,
    t2w: true,
    landline: true,
    cell: true
  });

  const toggleColumn = (column) => {
    setShowColumns({
      ...showColumns,
      [column]: !showColumns[column]
    });
  };

  useEffect(() => {
    if (promarkSurveyID && promarkSurveyID.length > 4) {
      setAllIDs('project', promarkSurveyID);
    }
  })

  const handleRun = async () => {
    await getSurveyQuotas();
    await axios.get("/quotas/merge", config)
      .then((response) => {
        setData(response.data);
      })
      .catch(handleErrors);
  };

  const handleSurveyIDChange = (e) => {
    const value = e.target.value;
    const source_id = e.target.id;
    console.log(`Quotas.js - handleSurveyIDChange - ${source_id} ${value}`);

    setPromarkSurveyID(value);
    setPromarkSurveyIDError(value.length < 5);
    if (value.length > 4) {
      localStorage.setItem("promarkSurveyID", value);
    }
  };

  return (
    <div>
      <div className='p-4 text-center bg-light' style={headerStyle}>
        <div className='dp-form' style={formDiv}>
          <div style={formStyle}>
            <SurveyForm
                id="project"
                surveyID={promarkSurveyID}
                surveyName={promarkSurveyName}
                isSurveyIDError={isPromarkSurveyIDError}
                handleSurveyIDChange={handleSurveyIDChange}
              />
          </div>
        </div>
        <Button onClick={handleRun}>Run</Button>
      </div>

      <div className='checkbox-container'>
        <label>Show/Hide Columns:</label>
        <div>
          <input type="checkbox" checked={showColumns.web} onChange={() => toggleColumn('web')} /> Web
        </div>
        <div style={{ paddingLeft: '1%' }}>
          <input type="checkbox" checked={showColumns.panel} onChange={() => toggleColumn('panel')} /> Panel
        </div>
        <div style={{ paddingLeft: '1%' }}>
          <input type="checkbox" checked={showColumns.t2w} onChange={() => toggleColumn('t2w')} /> T2W
        </div>
        <div>
          <input type="checkbox" checked={showColumns.phone} onChange={() => toggleColumn('phone')} /> Phone
        </div>
        <div style={{ paddingLeft: '1%' }}>
          <input type="checkbox" checked={showColumns.landline} onChange={() => toggleColumn('landline')} /> Landline
        </div>
        <div style={{ paddingLeft: '1%' }}>
          <input type="checkbox" checked={showColumns.cell} onChange={() => toggleColumn('cell')} /> Cell
        </div>
      </div>

      <div className="upper-container">
        <div className="legend-container">
          <Table className="legend-table" style={{ width: "10%" }} striped>
            <thead>
              <tr>
                <th scope='col' colSpan='7' className="legend-header">Legend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="status-open">Open</td>
                <td className="status-closed">Closed</td>
                <td className="below-10">+10 below</td>
                <td className="near-10-below">~10 below</td>
                <td className="within-1">Within 1</td>
                <td className="near-10-above">~10 above</td>
                <td className="above-10">+10 above</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <div style={{ display: 'flex', width: "100%", alignItems: "center", justifyContent: "center" }}>
        {Object.keys(data).length > 0 && (
          <QuotaTable data={data} showColumns={showColumns} />
        )}
      </div>
    </div>
  );
}

export default Quotas;

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
};

const formDiv = {
  display: 'flex',
  flexDirection: 'row',
  width: "40%",
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
};

const formTextBox = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
  width: '70%',
};