import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from 'react-bootstrap/Table';

function CheckboxForm({ questions, handleCheckboxChange }) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>QNAME</th>
          <th>Table</th>
        </tr>
      </thead>
      <tbody>
        {(typeof questions === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          questions.map((question ,i) => (
            <tr key={i}>
              <td style={{verticalAlign: 'middle'}}>{question}</td>
              <td>
                <Checkbox
                  type="checkbox"
                  name={question}
                  id={question}
                  defaultChecked
                  onChange={() => handleCheckboxChange(question)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default CheckboxForm;
