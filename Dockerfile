FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /code

# Copy only what's needed
COPY requirements.txt .

COPY .env .env

# Install dependencies
RUN pip install -r requirements.txt

COPY . .

# Expose Django dev server port
EXPOSE 8000

# Start Django dev server
CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]