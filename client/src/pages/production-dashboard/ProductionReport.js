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
      <Dropdown>
        <Dropdown.Toggle variant="success" id="location-dropdown">
          Location
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/loc1">Location 1</Dropdown.Item>
          <Dropdown.Item href="#/loc2">Location 2</Dropdown.Item>
          <Dropdown.Item href="#/loc3">Location 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default ProductionReport;

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  alignContent: 'center',
  width: '100%'
}
