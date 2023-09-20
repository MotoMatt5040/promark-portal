from flask import Flask, render_template
from core.twilio_requests import TwilioRequests
from utils.database.datapuller import DataPuller

twilio_requests = TwilioRequests()
app = Flask(__name__)

data_puller = DataPuller()


@app.route('/home', methods=['GET', 'POST'])
def home():
    """App home page"""
    # return render_template('')
    # return render_template('home.html')
    # print("connection found")
    return {"test Data": "1"}


@app.route('/send-message', methods=['GET', 'POST'])
def background_text_loading():
    """Background text loading tester"""
    print('sent message')
    # print(data_puller.promark_phone_numbers()["phone_number"][0])
    # TODO cycle the phone numbers
    twilio_requests.send_sms(from_=data_puller.promark_phone_numbers()["phone_number"][0], to="8325853212")
    print(twilio_requests.get_message_data())
    return "nothing"


if __name__ == '__main__':
    # app.run(debug=True)
    app.run(ssl_context=('c38827a1bd357111.pem', 'promarkresearch.com.key'))  # this is required to run the proxy
