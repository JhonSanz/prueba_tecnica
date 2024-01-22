FROM python:3.11-alpine

RUN mkdir /app
WORKDIR /app

COPY . .

RUN sed -i 's/\r$//g' ./local/entrypoint.sh
RUN chmod +x ./local/entrypoint.sh

RUN pip install -r ./local/requirements.txt
EXPOSE 8000
ENTRYPOINT ["/bin/sh", "./local/entrypoint.sh"]
