FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install uv package manager
RUN pip install --no-cache-dir uv

# Copy project definition files
COPY pyproject.toml .

# Install dependencies using uv
RUN uv pip install --system -r <(python -c "
import tomllib
with open('pyproject.toml', 'rb') as f:
    data = tomllib.load(f)
for dep in data['project']['dependencies']:
    print(dep)
") || pip install --no-cache-dir fastapi uvicorn pydantic pydantic-settings langchain langchain-core langchain-community langgraph sentence-transformers httpx python-dotenv numpy pytest pytest-asyncio

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 8000

# Run FastAPI backend server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
