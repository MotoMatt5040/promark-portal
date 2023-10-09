import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './Home';
import SampleUpload from "./texting-platform/SampleUpload";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {

return (
  <BrowserRouter>
    <main>

      <Header title="React Navbar Component"/>

      <Routes>

        <Route index element={<Home />} />
        <Route path="/texting_platform/sample_upload" element={<SampleUpload />} />
      </Routes>
    </main>
  </BrowserRouter>
)
}
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


