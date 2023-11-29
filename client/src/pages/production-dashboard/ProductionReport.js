import axios from "../../api/axios";
import Dropdown from 'react-bootstrap/Dropdown';

function ProductionReport() {

  const getLocations = () => {
    axios.get('/', {
      responseType: 'application/json',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((obj) => {
        console.log(obj.data);
      })
      .catch(error => console.error(error))
  };

  return (
    <div className="container" id="production-report-container" style={containerStyle}>
      <div className="dropdowns" id="dropdowns" style={dropdownStyle}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="location-dropdown">
            Location
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Location 1</Dropdown.Item>
            <Dropdown.Item>Location 2</Dropdown.Item>
            <Dropdown.Item>Location 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="interviewers">Interviewers</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Name 1</Dropdown.Item>
            <Dropdown.Item>Name 2</Dropdown.Item>
            <Dropdown.Item>Name 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default ProductionReport;

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}

const dropdownStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}
