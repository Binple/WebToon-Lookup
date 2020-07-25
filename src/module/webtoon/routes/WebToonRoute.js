import express from 'express';
import WebToonController from "../controllers/WebToonController";

const router = express.Router();

const webtoonController = new WebToonController();

/**
 * @swagger
 * tags:
 *   name: WebToon
 *   description: WebToon 조회 API
 */

/**
 * @swagger
 * /webtoon/lookup:
 *   post:
 *     tags: [WebToon]
 *     summary: 최근 5회 웹툰 정보 조회
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type:  object
 *           required:
 *             - portal
 *             - toon
 *           properties:
 *             portal:
 *               type: string
 *               enum: [DAUM, NAVER]
 *               example: DAUM
 *               description: 불러올 포털 이름 DAUM, NAVER 만 가능
 *             toon:
 *               type: string
 *               example: 26년
 *               description: 웹툰 제목 정확히 입력 해야 한다.
 *     responses:
 *       200:
 *         description: 성공
 *       400:
 *         description: 잘못된 요청
 *       403:
 *         description: 인증 정보 필요
 */
router.post('/lookup', webtoonController.getList); // 웹툰 조회


module.exports = router;