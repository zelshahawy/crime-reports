FROM python:3.12-slim

WORKDIR /server
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /server

# Expose port 8000 for FastAPI
EXPOSE 8000

# Using gunicorn + uvicorn worker
CMD ["gunicorn", "main:app", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]

