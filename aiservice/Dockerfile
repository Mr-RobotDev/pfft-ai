FROM python:3.10-alpine3.17

EXPOSE 8000
RUN apk add build-base \ 
        linux-headers

COPY . ./app
RUN pip install uwsgi flask python-dotenv openai===1.7.2 together pandas

WORKDIR /app

ENTRYPOINT [ "uwsgi" ]
CMD [ "--ini", "uwsgi.ini" ]