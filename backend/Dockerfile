FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

WORKDIR /app

EXPOSE 80

COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt
COPY . /app

# Optionally, specify port and host when running
# docker run -d -p 80:80 my-fastapi-app
