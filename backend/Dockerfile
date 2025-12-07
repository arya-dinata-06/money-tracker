# -------------------------------------
# Backend Dockerfile (FastAPI + uvicorn)
# -------------------------------------

FROM python:3.11-slim

# Install system dependencies required for bcrypt, passlib, bson, and pymongo
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    python3-dev \
 && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements first (better caching)
COPY backend/requirements.txt /app/requirements.txt

# Install python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend source code
COPY backend/ /app/

# Expose API port
EXPOSE 8001

# Start FastAPI using uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
