FROM python:3.10

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el backend
COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
