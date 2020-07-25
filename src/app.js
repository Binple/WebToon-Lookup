import express from 'express'; // expressjs
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes'; // router
import webtoonRouter from './module/webtoon/routes/WebToonRoute'; // Webtoon Router

// Swagger 관련
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'

const app = express();

app.use(logger('dev')); // Debug Mode
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 주소

app.use('/', indexRouter); // 메인용 라우터
app.use('/webtoon', webtoonRouter); // 웹툰 조회 라우터

// region Swagger 설정
let swaggerDefinition = {
	info: {
		title: 'Webtoon Lookup API',
		version: '1.0.0',
		description: '웹툰 최근 목록 조회 API',
	},
	host: 'localhost:3000',
	basePath: '/',
}

let options = {
	swaggerDefinition: swaggerDefinition, // Swagger 메인 정의
	apis: ['./src/module/**/*Route.js'], // Swagger 정의 경로
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// endregion Swagger 설정

module.exports = app;
