FROM python:3.11-alpine
COPY . /app
WORKDIR /app
# Install build dependencies
RUN apk add python3-dev
RUN apk add build-base
# RUN apk add --no-cache build-base
# Install Python dependencies
RUN pip install --upgrade pip
# RUN apk add gcc python3-dev
# RUN apk add linux-headers
# RUN apk add py3-psutil
# RUN pip install --upgrade psutil
RUN pip3 install wheel python-dotenv flask_cors flask 
RUN pip install dapr
# https://github.com/open-telemetry/opentelemetry-python-contrib/issues/2053#issuecomment-1845408543
# RUN pip install opentelemetry-distro==0.41b0 opentelemetry-exporter-otlp==1.20.0
# RUN pip install opentelemetry-distro opentelemetry-exporter-otlp
# RUN opentelemetry-bootstrap -a install
ENTRYPOINT ["python"]
EXPOSE 5000
CMD ["messages.py"]