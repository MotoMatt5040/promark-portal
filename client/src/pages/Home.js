import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {

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
              &emsp;&emsp;&emsp;Added a sidebar for navigation<br/>
              <br/>
              &emsp;<a href='/global_quotas'>Global Quota Module</a><br/>
              &emsp;&emsp;<b>New Features:</b><br/>
              &emsp;&emsp;&emsp;Input survey ID fields to output a table with merged quota data.<br/>
              &emsp;&emsp;&emsp;Stylized data table for quick viewing and data highlights<br/>
            </p>
          </div>
          Version = {process.env.REACT_APP_VERSION}
        </div>

      </main>
    )
}

export default Home;
