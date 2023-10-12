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
    }, [])

    return (
      <main>
        <div className="col-md-6">
          <div className="h-100 p-5 bg-light border rounded-3">
            <h2>Add borders</h2>
            <p>Or, keep it light and add a border for some added definition to the boundaries of your content. Be sure
              to look under the hood at the source HTML here as we've adjusted the alignment and sizing of both column's
              content for equal-height.</p>
            <button className="btn btn-outline-secondary" type="button">Example button</button>
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