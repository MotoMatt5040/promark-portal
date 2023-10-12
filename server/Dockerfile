FROM python:3.11
MAINTAINER Matt Werner <matt.w@promarkresearch.com>
WORKDIR	/code
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000/tcp
RUN su
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN exit
RUN apt-get update
RUN ACCEPT_EULA=Y apt-get install -y msodbcsql17
RUN wget https://www.openssl.org/source/openssl-1.1.1p.tar.gz -O openssl-1.1.1p.tar.gz
RUN tar -zxvf openssl-1.1.1p.tar.gz
RUN cd openssl-1.1.1p && ./config && make && make install && ldconfig && openssl version
ENTRYPOINT ["python", "app.py"]
