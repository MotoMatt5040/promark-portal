import React from 'react';
import Table from 'react-bootstrap/Table';

const QuotaTable = ({ data, showColumns }) => {
  return (
    <Table style={{width: "50%", border: '1px solid black'}} striped>
        <thead>
            <tr>
                <th scope="col" colSpan="5"
                    style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}></th>
                {showColumns.web && <th scope="col"
                                        colSpan={showColumns.panel && showColumns.t2w ? "8" : (!showColumns.panel && !showColumns.t2w ? "2" : "5")}
                                        style={{
                                        border: '1px solid black',
                                        background: "lightgrey",
                                        textAlign: "center"
                                        }}>Web</th>}
                {showColumns.phone && <th scope="col"
                                        colSpan={showColumns.landline && showColumns.cell ? "8" : (!showColumns.landline && !showColumns.cell ? "2" : "5")}
                                        style={{
                                            border: '1px solid black',
                                            background: "lightgrey",
                                            textAlign: "center"
                                        }}>Phone</th>}
            </tr>
            <tr>
                <th scope="col" colSpan="5"
                    style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Global
                </th>
                {showColumns.web && <>
                <th scope="col" colSpan="2"
                    style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Total
                </th>
                {showColumns.panel && <th scope="col" colSpan="3" style={{
                    border: '1px solid black',
                    background: "lightgrey",
                    textAlign: "center"
                }}>Panel</th>}
                {showColumns.t2w && <th scope="col" colSpan="3" style={{
                    border: '1px solid black',
                    background: "lightgrey",
                    textAlign: "center"
                }}>T2W</th>}
                </>}
                {showColumns.phone && <>
                <th scope="col" colSpan="2"
                    style={{border: '1px solid black', background: "lightgrey", textAlign: "center"}}>Total
                </th>
                {showColumns.landline && <th scope="col" colSpan="3" style={{
                    border: '1px solid black',
                    background: "lightgrey",
                    textAlign: "center"
                }}>Landline</th>}
                {showColumns.cell && <th scope="col" colSpan="3" style={{
                    border: '1px solid black',
                    background: "lightgrey",
                    textAlign: "center"
                }}>Cell</th>}
                </>}
            </tr>

            <tr>
                <th style={{border: '1px solid black'}}>Criterion</th>
                <th style={{border: '1px solid black'}}>Label</th>
                <th style={{border: '1px solid black'}}>Obj</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                <th style={{border: '1px solid black'}}>ToDo</th>

                {showColumns.web && <>
                <th style={{border: '1px solid black'}}>%</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                {showColumns.panel && <>
                    <th style={{border: '1px solid black'}}>Obj</th>
                    <th style={{border: '1px solid black'}}>Freq</th>
                    <th style={{border: '1px solid black'}}>%</th>
                </>}
                {showColumns.t2w && <>
                    <th style={{border: '1px solid black'}}>Obj</th>
                    <th style={{border: '1px solid black'}}>Freq</th>
                    <th style={{border: '1px solid black'}}>%</th>
                </>}
                </>}
                {showColumns.phone && <>
                <th style={{border: '1px solid black'}}>%</th>
                <th style={{border: '1px solid black'}}>Freq</th>
                {showColumns.landline && <>
                    <th style={{border: '1px solid black'}}>Obj</th>
                    <th style={{border: '1px solid black'}}>Freq</th>
                    <th style={{border: '1px solid black'}}>%</th>
                </>}
                {showColumns.cell && <>
                    <th style={{border: '1px solid black'}}>Obj</th>
                    <th style={{border: '1px solid black'}}>Freq</th>
                    <th style={{border: '1px solid black'}}>%</th>
                </>}
                </>}
            </tr>
        </thead>
        <tbody>
            {Object.keys(data.Criterion).map((key, index) => (

                <tr key={index}>
                    <td style={{borderLeft: "1px solid black"}}>{data.Criterion[index]}</td>
                    <td style={{borerLeft: "1px solid black"}}>{data['COM Label'][index]}</td>
                    <td>{data['COM Objective'][index]}</td>
                    <td>{data['COM Frequency'][index]}</td>
                    <td style={{borderRight: "1px solid black"}}>{data['COM To Do'][index]}</td>
                    {/*<td style={{borerLeft: "1px solid black"}}>{data['Web Label'][index]}</td>*/}

                    {showColumns.web && <>
                    <td style={{borderRight: "1px solid black"}}>{data['W%'][index]}%</td>
                    <td style={{borderRight: "1px solid black"}}>{data['Web Frequency'][index]}</td>
                    {/*PANEL*/}
                    {showColumns.panel && <>
                        <td style={{
                        backgroundColor: (data['Panel Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                        color: "white"
                        }}
                        >
                        {data['Panel Objective'][index]}
                        </td>
                        <td
                            style={{
                            color:
                                (-1 <= data["Panel Frequency"][index] - data["Panel Objective"][index] && 1 >= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "" :
                                    (-10 <= data["Panel Frequency"][index] - data["Panel Objective"][index] && 10 >= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "darkorange" :
                                        "crimson",
                            backgroundColor:
                                (-1 > data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "" :
                                    (-1 <= data["Panel Frequency"][index] - data["Panel Objective"][index] && 1 >= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "lightgreen" :
                                        (10 >= data["Panel Frequency"][index] - data["Panel Objective"][index] && 2 <= data["Panel Frequency"][index] - data["Panel Objective"][index]) ? "lightyellow" :
                                            "lightpink"
                            }}>
                        {data['Panel Frequency'][index]}
                        </td>
                        <td style={{borderRight: "1px solid black"}}>{data['P%'][index]}%</td>
                        {/*END PANEL*/}
                    </>}

                    {showColumns.t2w && <>
                        {/*T2W*/}
                        <td style={{
                        backgroundColor: (data['T2W Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                        color: "white"
                        }}
                        >
                        {data['T2W Objective'][index]}
                        </td>
                        <td
                            style={{
                            color:
                                (-1 <= data["T2W Frequency"][index] - data["T2W Objective"][index] && 1 >= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "" :
                                    (-10 <= data["T2W Frequency"][index] - data["T2W Objective"][index] && 10 >= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "darkorange" :
                                        "crimson",
                            backgroundColor:
                                (-1 > data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "" :
                                    (-1 <= data["T2W Frequency"][index] - data["T2W Objective"][index] && 1 >= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "lightgreen" :
                                        (10 >= data["T2W Frequency"][index] - data["T2W Objective"][index] && 2 <= data["T2W Frequency"][index] - data["T2W Objective"][index]) ? "lightyellow" :
                                            "lightpink"
                            }}>
                        {data['T2W Frequency'][index]}
                        </td>
                        <td style={{borderRight: "1px solid black"}}>{data['T%'][index]}%</td>
                        {/*END T2W*/}
                    </>}
                    </>}

                    {showColumns.phone && <>
                    {/*PHONE*/}
                    <td style={{borderRight: "1px solid black"}}>{data['Phone%'][index]}%</td>
                    <td style={{borderRight: "1px solid black"}}>{data['Phone Frequency'][index]}</td>
                    {showColumns.landline && <>
                        {/*LANDLINE*/}
                        <td style={{
                        backgroundColor: (data['LL Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                        color: "white"
                        }}
                        >
                        {data['LL Objective'][index]}
                        </td>
                        <td
                            style={{
                            color:
                                (-1 <= data["LL Frequency"][index] - data["LL Objective"][index] && 1 >= data["LL Frequency"][index] - data["LL Objective"][index]) ? "" :
                                    (-10 <= data["LL Frequency"][index] - data["LL Objective"][index] && 10 >= data["LL Frequency"][index] - data["LL Objective"][index]) ? "darkorange" : "crimson",
                            backgroundColor:
                                (-1 > data["LL Frequency"][index] - data["LL Objective"][index]) ? "" :
                                    (-1 <= data["LL Frequency"][index] - data["LL Objective"][index] && 1 >= data["LL Frequency"][index] - data["LL Objective"][index]) ? "lightgreen" :
                                        (10 >= data["LL Frequency"][index] - data["LL Objective"][index] && 2 <= data["LL Frequency"][index] - data["LL Objective"][index]) ? "lightyellow" : "lightpink"
                            }}>
                        {data['LL Frequency'][index]}
                        </td>
                        <td style={{borderRight: "1px solid black"}}>{data['L%'][index]}%</td>
                        {/*END LANDLINE*/}
                    </>}
                    {showColumns.cell && <>
                        {/*CELL*/}
                        <td
                            style={{
                            backgroundColor: (data['Cell Status'][index] === "Open") ? "#43B17B" : "#ED211C",
                            color: 'white'
                            }}
                        >
                        {data['Cell Objective'][index]}
                        </td>
                        <td
                            style={{
                            color:
                                (-1 <= data["Cell Frequency"][index] - data["Cell Objective"][index] && 1 >= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "" :
                                    (-10 <= data["Cell Frequency"][index] - data["Cell Objective"][index] && 10 >= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "darkorange" : "crimson",
                            backgroundColor:
                                (-1 > data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "" :
                                    (-1 <= data["Cell Frequency"][index] - data["Cell Objective"][index] && 1 >= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "lightgreen" :
                                        (10 >= data["Cell Frequency"][index] - data["Cell Objective"][index] && 2 <= data["Cell Frequency"][index] - data["Cell Objective"][index]) ? "lightyellow" : "lightpink"
                            }}>
                        {data['Cell Frequency'][index]}
                        </td>
                        <td style={{borderRight: "1px solid black"}}>{data['C%'][index]}%</td>
                        {/*END CELL*/}
                    </>}

                    {/*END PHONE*/}
                    </>}

                </tr>
            ))}
        </tbody>
    </Table>
  );
};

export default QuotaTable;