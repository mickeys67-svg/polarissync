FROM python:3.11-slim

WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 복사
COPY ./app ./app

# Alembic 관련 (디렉토리가 생성된 경우에만 복사)
COPY ./alembic ./alembic
COPY alembic.ini .

# 포트 노출
EXPOSE 8000

# 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
