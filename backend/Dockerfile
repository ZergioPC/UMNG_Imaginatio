FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

WORKDIR /app

RUN apt-get update && apt-get install -y \
   gcc \
   postgresql-client \
   && rm -rf /var/lib/apt/lists/*

EXPOSE 80

COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt
COPY . /app

#Optionally, specify port and host when running
#docker run -d -p 80:80 my-fastapi-app
