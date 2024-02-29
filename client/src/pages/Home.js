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
              &emsp;<a href='/data_processing'>Data Processing</a>
            </p>
            {/*<button className="btn btn-outline-secondary" type="button">Example button</button>*/}
          </div>
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