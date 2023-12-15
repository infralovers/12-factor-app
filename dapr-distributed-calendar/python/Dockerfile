FROM python:3.12-alpine
COPY . /app
WORKDIR /app
# Install build dependencies
RUN apk add --no-cache build-base
# Install Python dependencies
RUN pip3 install wheel python-dotenv flask_cors flask 
RUN pip install dapr
ENTRYPOINT ["python"]
EXPOSE 5000
CMD ["messages.py"]