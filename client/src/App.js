import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import DataProcessing from "./pages/data-processing/DataProcessing";
import ProductionReport from "./pages/production-dashboard/ProductionReport";
import PeriodicUpdate from "./pages/production-dashboard/PeriodicUpdate";
import Quotas from "./pages/global-quota-module/Quotas"
import Logout from "./pages/auth/Logout";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/profile/Settings";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import AddUser from "./pages/auth/AddUser";

function App() {

  if (localStorage.getItem('logged_in') === null) {
    localStorage.setItem("logged_in", false);
  }

  return (
    <BrowserRouter>
      <main>
        <Header title="React Navbar Component" />
        <Routes>
          {/*These are routes that require the user to be logged in*/}
          <Route element={<PrivateRoutes />}>
            <Route path="data_processing" element={<DataProcessing/>}/>
            <Route path="production_report" element={<ProductionReport/>} />
            <Route path="periodic_update" element={<PeriodicUpdate/>}/>
            <Route path="global_quotas" element={<Quotas/>}/>

            <Route path="profile" element={<Profile/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="add_user" element={<AddUser/>}/>
          </Route>

          {/*These are routes that can be access regardless of login status*/}
          <Route path="/login" element={<Login />}/>
          <Route path="logout" element={<Logout/>}/>
          <Route index element={<Home/>}/>
          <Route path="home" element={<Home/>}/>
        </Routes>
        <a href="https://www.promarkresearch.com/privacy-policy/" style={{width: '100vw', justifyContent: 'center', position: 'fixed', display: 'flex'}}>Privacy Policy</a>
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


