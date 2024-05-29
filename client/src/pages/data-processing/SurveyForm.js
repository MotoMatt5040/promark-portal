import React from 'react';
import Form from "react-bootstrap/Form";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

function SurveyForm({ surveyID, handleSurveyIDChange, taskList, setTaskName, setExtractionId, handleShow, handleTaskSelectChange, taskName }) {
  return (
    <div className='dp-form'>
      <div>
        <Form.Group className="mb-3" controlId="formGroupSruveryId">
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              value={surveyID}
              onChange={handleSurveyIDChange}
              label="Acuity Survey ID"
              required
              variant="standard"
            />
            <br/>
            <FormControl>
              <InputLabel id="task-list-label">Task List</InputLabel>
              <Select
                labelId="task-list-label"
                id="task-list"
                label="Task List"
                value={taskName}
                onChange={(e) => handleTaskSelectChange(e, setTaskName, setExtractionId, taskList)}
              >
                {taskList && taskList.map((task, index) => (
                  <MenuItem key={index} value={task.Name}>{task.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <br/>
            <Button variant="primary" type="submit" onClick={handleShow}>Checkboxes</Button>
          </Box>
        </Form.Group>
      </div>
    </div>
  );
}

export default SurveyForm;
