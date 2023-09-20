<b>texting-platform:</b>

<b>sub-directories:</b>\
    &emsp;<b>core:</b>\
        &emsp;&emsp;Core texting program\
    &emsp;<b>utils:</b>\
        &emsp;&emsp;Utilities involved to determine whether messages can be sent, also used for databasing\
    &emsp;<b>static:</b>\
        &emsp;&emsp;css styling directory\
    &emsp;<b>templates:</b>\
        &emsp;&emsp;html web page templates

<b>Usage:</b>\
    &emsp;A user will connect to a webpage that is used to send/receive SMS or MMS texts.

<b>app.py:</b>\
    &emsp;Flask server used to handle requests

<b>Dockerfile:</b>\
    &emsp;Used to create image built with dependencies for docker container

<b>DockerfileCode:</b>\
    &emsp;Used to package code for Dockerfile

<b>Pipfile.lock:</b>\
    &emsp;Used to create virtual environment

<b>requirements.txt:</b>\
    &emsp;Used to install proper requirements (called from Dockerfile)

<b>Things to be added:</b>\
    &emsp;- 3 (Opt-out / Do Not Contact / Do Not Disturb) database checked for every project to remove bad numbers\
    &emsp;- 2 Texter display window should contain MESSAGE being sent and display the recipient's info that was imported\
    &emsp;-Timezone checking BEFORE texts get queued so messages won't get sent outside allowed texting times\
    &emsp;- 1 Response handling\
    &emsp;-Database that stores time message was queued and sent\
    &emsp;-Database used to check our phone number productivity\
        &emsp;&emsp;if 50k sent and 1k response on one number but 25k sent and 2k response on another number, may signify bad number
