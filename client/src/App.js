import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './pages/Home';
import SampleUpload from "./pages/texting-platform/SampleUpload";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import { useState, useEffect } from 'react';
import UserInterface from './pages/auth/userInterface.ts';
import axios from './api/axios';
import DataProcessing from "./pages/data-processing/DataProcessing";

function App() {
  // const [session , setSession] = useState();
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await axios.get("/@me");
  //       setUser(response.data);
  //     } catch (error) {
  //       console.log("Not Authenticated");
  //       console.log(error);
  //     }
  //   })();
  // }, [setUser]);

  // if(!session) {
  //   return <Login setSession={setSession} />;
  // }
  // console.log(session);


  return (

    <BrowserRouter>
      <main>
        <Header title="React Navbar Component"/>
        <Routes>
          <Route index element={<Home/>}/>
          {/*<Route path="/home" element={<Home />} />*/}
          <Route path="data_processing" element={<DataProcessing />}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

//   const [currentNumber, newNumber] = useState();
//
//   const [currentData, setData] = useState([{}])
//
//     useEffect(() => {
//         fetch("/home").then(
//             res => res.json()
//         ).then(
//             data => {
//                 setData(data)
//                 console.log(data, currentNumber, newNumber, currentData)
//             }
//         )
//     }, [])
//
//   return (
//     <div className="App">
//       <div className="jumbotron">
//         <h1 id="phone_number" className="display-4">Texting Platform Landing Page</h1>
//         <p className="lead">This page will be our portal for texting components with our twilio application</p>
//         <hr className="my-4"/>
//           <p>Press the button below to send a test message.</p>
//         {/*form will be replaced with a useState*/}
//           <form>
//             <a href="#" id="test">
//               <button className="btn btn-primary btn-lg">Send Test Message</button>
//             </a>
//           </form>
//           {/*<p>this.state.setData</p>*/}
//       </div>
//     </div>
//   );
// }
export default App;
//
// import logo from './logo.svg';
// import './App.css';
// import React from "react";
// import { useState } from 'react';
// import { DatePicker } from 'react-datepicker'
//
// function App() {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(null);
//   const onChange = (dates) => {
//     const [start, end] = dates;
//     setStartDate(start);
//     setEndDate(end);
//   };
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={onChange}
//       startDate={startDate}
//       endDate={endDate}
//       excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
//       //   excludeDates={[]}
//       selectsRange
//       selectsDisabledDaysInRange
//       inline
//     />
//   );
// }


