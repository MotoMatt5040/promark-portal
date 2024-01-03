import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

import Offcanvas from 'react-bootstrap/Offcanvas';
import Table from 'react-bootstrap/Table';
import Instructions from "./Instructions";

const DATA_PROCESSING_URL = '/data_processing';
const QUESTIONS_URL = '/questions';
const PROCESS_DATA_URL = '/questions/process_data';
const DOWNLOAD_URL = '/download';
function DataProcessing() {

  const [validated, setValidated] = useState(false);
  const [surveyID, setSurveyID] = useState(false);
  const [projectID, setProjectID] = useState(false);
  const [errorMessage, setErrorMesssage] = useState('');
  const [questions, setQuestions] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [selectedValues, setSelectedValues] = useState({});

  const handleCheckboxChange = (question) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [question]: !prevValues[question], // Toggle the boolean value
    }));
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      const initialSelectedValues = {};
      questions.forEach((question) => {
        initialSelectedValues[question] = true;
      });
      setSelectedValues(initialSelectedValues);
    }
  }, [questions]);

  const handleShow = async (event) => {
    event.preventDefault();
    try {
      let config = {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      const response = await axios.post(
        DATA_PROCESSING_URL + QUESTIONS_URL,
        { surveyID, projectID },
        config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for data processing')
      }
        // console.log(JSON.stringify(response));
      setQuestions(JSON.parse(JSON.stringify(response.data)));


    } catch (error) {
      if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Login Failed')
      }
    }
    setShow(true)
  };

  const handleValidation = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleRun = async (event) => {
    event.preventDefault();
    try {
      let config = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      console.log("data")
      console.log(selectedValues);
      const response = await axios.post(
      DATA_PROCESSING_URL + PROCESS_DATA_URL,
      {
        selectedValues,
        totalStyleChecked: document.getElementById("total-style").checked
      },
      config
      );

      if (response.status === 200) {
        window.location.href="#"
        console.log('Request sent for data processing')
      }
      // console.log(JSON.stringify(response));
    } catch (error) {
       if (!error?.response) {
        setErrorMesssage('No Server Response')
      } else if (error.response.status === 401) {
        setErrorMesssage('Invalid Credentials')
      } else {
        setErrorMesssage('Request Failed')
      }
    }
  }

  const handleDownload = async () => {
    axios.get(DATA_PROCESSING_URL + DOWNLOAD_URL, {
      responseType: 'blob',
      headers: {
            'Content-Type': 'application/json',
          }
    })
      .then((obj) => {
        console.log(obj.data)
        const url = URL.createObjectURL(obj.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file.zip';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error(error))
  }

    return (
      <div>
        <div className='p-4 text-center bg-light' style={headerStyle}>
          <div className='invis-form-spacer' style={invisFormSpacerStyle} />
          <div className='dp-form' style={formDiv}>

            <Form
              noValidate
              validated={validated}
              onChange={handleValidation}
              style={formStyle}>
              <div style={formTextBox}>
                <Form.Group className="mb-3" controlId="formGroupSruveryId">
                  <Form.Label>Acuity Survey ID</Form.Label>
                  <Form.Control
                    type="text"
                    autoComplete="off"
                    onChange={(e) => setSurveyID(e.target.value)}
                    placeholder="Survey ID"
                    required
                  />
                  <Form.Text id="SurveyIDnote" muted>
                    Step 3
                  </Form.Text>
                  <Form.Control.Feedback>Good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupProjectId">
                  <Form.Label>PRC Project Number</Form.Label>
                  <Form.Control
                    type="text"
                    autoComplete="off"
                    onChange={(e) => setProjectID(e.target.value)}
                    placeholder="Project Number"
                    required
                  />
                  <Form.Text id="SurveyIDnote" muted>
                    Promark Project Number
                  </Form.Text>
                  <Form.Control.Feedback>Good!</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div style={formButtons}>
                <Button variant="primary" onClick={handleShow}>Checkboxes</Button>
              </div>
            </Form>
          </div>
          <div style={downloadButtonDivStyle}>
            <Button onClick={handleDownload}>Download</Button>
          </div>
        </div>
        <br/>
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Layout</Offcanvas.Title>
            <Button type="submit" onClick={handleRun}>Run</Button>
            <br/>
            <label><b>Inline Total</b></label>
            <input type="checkbox" name="total-style" id="total-style" />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Table style={{width: "100%"}} striped>
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
                        <td>{question}</td>
                        <td>
                          <input
                            type="checkbox"
                            type="checkbox"
                            name={question}
                            id={question}
                            checked={selectedValues[question]}
                            onChange={() => handleCheckboxChange(question)}
                          />
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          </Offcanvas.Body>
        </Offcanvas>
        <Instructions/>
      </div>
    )
}

export default DataProcessing;

const headerStyle = {
  // border: '1px solid green',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  alignContent: 'center',
}

const invisFormSpacerStyle = {
  // border: '1px solid black',
  display: 'flex',
}

const formDiv = {
  // border: '1px solid blue',
  display: 'flex',
  flexDirection: 'row',
  width: "40%",
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}

const formStyle = {
  // border: '1px solid red',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
}

const formTextBox = {
  // border: '1px solid green',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  alignContent: 'center',
  flexGrow: '1',
  width: '70%'
}

const formButtons = {
  // border: '1px solid pink',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: "30%"
}

const downloadButtonDivStyle = {
  // border: '1px solid pink',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'right',
  justifyContent: 'right',
  alignContent: 'right',
  // paddingLeft: '30%'
  // width: "100%"
}
