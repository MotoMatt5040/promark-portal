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
        <p>TEST</p>
        <form>
          <a href="#" id="test">
            <button className="btn btn-primary btn-lg">{currentData}</button>
          </a>
        </form>
      </main>
    )
}

export default Home;