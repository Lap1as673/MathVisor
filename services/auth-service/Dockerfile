FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/base.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /app/app

RUN touch /app/app/__init__.py
RUN touch /app/app/api/__init__.py
RUN touch /app/app/api/v1/__init__.py
RUN touch /app/app/api/v1/endpoints/__init__.py
RUN touch /app/app/core/__init__.py
RUN touch /app/app/schemas/__init__.py
RUN touch /app/app/services/__init__.py
RUN touch /app/app/utils/__init__.py

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

RUN ls -la /app/ && ls -la /app/app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 
