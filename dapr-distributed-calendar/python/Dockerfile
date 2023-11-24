FROM python:3.7-alpine
COPY . /app
WORKDIR /app
RUN pip3 install wheel python-dotenv flask_cors flask 
RUN pip install dapr
ENTRYPOINT ["python"]
EXPOSE 5000
CMD ["messages.py"]