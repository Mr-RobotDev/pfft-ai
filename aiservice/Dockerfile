FROM python:3.10-alpine3.17

EXPOSE 8000
RUN apk add build-base \ 
        linux-headers
COPY . ./app
RUN pip install uwsgi
RUN pip install -r /app/requirements.txt

WORKDIR /app

ENTRYPOINT [ "uwsgi" ]
CMD [ "--ini", "uwsgi.ini" ]