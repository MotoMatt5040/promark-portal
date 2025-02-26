import React from 'react';
import Form from "react-bootstrap/Form";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const SurveyForm = ({ id, surveyID, surveyName, isSurveyIDError, handleSurveyIDChange }) => {
  return (
    <Form.Group className="mb-3" controlId="formGroupSruveryId">
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id={id}
          error={isSurveyIDError}
          autoComplete="off"
          onChange={handleSurveyIDChange}
          value={surveyID}
          label={surveyName}
          required
          variant="standard"
        />
      </Box>
    </Form.Group>
  );
};

export default SurveyForm;