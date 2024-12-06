FROM python:3.11-alpine

COPY . /app
WORKDIR /app

RUN apk add --virtual build-deps --no-cache gcc g++ \
    && pip3 install -r /app/requirements.txt \
    && apk del build-deps

EXPOSE 5000

ENTRYPOINT ["python", "messages.py"]
