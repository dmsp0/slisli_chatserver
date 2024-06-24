# 베이스 이미지로 Node.js를 사용
FROM node:14

# 작업 디렉토리를 생성
WORKDIR /app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 코드를 복사
COPY . .

# 애플리케이션 포트 노출
EXPOSE 5000

# 애플리케이션 시작 명령
CMD ["node", "server.js"]
