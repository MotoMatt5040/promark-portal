import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";

function Home() {

  const [currentData, setData] = useState([{}])

    useEffect(() => {
        fetch("/home").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data, currentData)
            }
        )
    }, )

    return (
      <main>
        <div className="col-md-6">
          <div className="h-100 p-5 bg-light border rounded-3">
            <h2>Promark Portal</h2>
            <p>
              Currently available features:<br/>
              &emsp;<a href='/periodic_update'>Periodic Update</a><br/>
              &emsp;&emsp;<b>New Features:</b><br/>
              &emsp;&emsp;&emsp;Select 'All' locations for viewing<br/>
              <br/>
              &emsp;<a href='/data_processing'>Data Processing</a><br/>
              &emsp;&emsp;<b>New Features:</b><br/>
              &emsp;&emsp;&emsp;UNCLE data extraction task is now auto created when 'Download' button is pressed. The 'Checkboxes' butten deletes the extraction task.<br/>
              <br/>
              &emsp;<a href='/global_quotas'>Global Quota Module</a><br/>
              &emsp;&emsp;<b>New Features:</b><br/>
              &emsp;&emsp;&emsp;Input survey ID fields to output a table with merged quota data.<br/>
            </p>
            {/*<button className="btn btn-outline-secondary" type="button">Example button</button>*/}
          </div>
          Version = {process.env.REACT_APP_VERSION}
        </div>

      </main>
    )
}

export default Home;

// <p>TEST</p>
//         <form>
//           <a href="#" id="test">
//             <button className="btn btn-primary btn-lg">{currentData}</button>
//           </a>
//         </form>