from dotenv import load_dotenv

load_dotenv()

from defaults.core.server_routes import defaultRoutes
from waitress import serve


#  TODO: projects going forwards
#  SPSS Automation (toplines, basically remove spss)
#  banner automation
#  weighting automation
#  global quota module
#  quota calculation automation
#  sample formatting automation
#  COM File update automation (CC3 Completes)

# INDIVIDUAL METRICS: LIVE PERIODIC UPDATE PROJECT LEVEL
#   - HOURS
#   - CPH
#   - LEN
#   - MPH
#   - DPH
#   - SAMPLE UTILIZATION

if __name__ == '__main__':
    print("http://localhost:5000/")
    serve(
        defaultRoutes.app,
        host='0.0.0.0',
        port=5000,
        threads=10,
        url_scheme="http"
    )
    # defaultRoutes.app.run(ssl_context=('b27662e91187c7e3.crt', 'promarkresearch.com.key'))
