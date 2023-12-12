FROM python:3.11
MAINTAINER Matt Werner <matt.w@promarkresearch.com>
WORKDIR	/code
EXPOSE 5000/tcp
RUN su
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN exit
RUN apt-get update
RUN ACCEPT_EULA=Y apt-get install -y msodbcsql17
RUN wget https://www.openssl.org/source/openssl-1.1.1w.tar.gz -O openssl-1.1.1w.tar.gz
RUN tar -zxvf openssl-1.1.1w.tar.gz
RUN cd openssl-1.1.1w && ./config && make && make install && ldconfig && openssl version
RUN cd ..
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
COPY . .
ENTRYPOINT ["python", "app.py"]
