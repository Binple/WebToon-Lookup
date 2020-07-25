'use strict';

import LookupDaumService from "./LookupDaumService";
import LookupNaverService from "./LookupNaverService";
import WebToonException from "../models/WebToonException";

const lookupDaumService = new LookupDaumService();
const lookupNaverService = new LookupNaverService();

export default class LookupService {

	// 다음과 네이버에 대한 구현 코드를 분리 한다.
	get service() {
		if (this.portal.toUpperCase() === 'DAUM' || this.portal === '다음') {
			return lookupDaumService;
		}
		if (this.portal.toUpperCase() === 'NAVER' || this.portal === '네이버') {
			return lookupNaverService;
		}
		throw new WebToonException(400, 'portal을 바르게 입력하여 주십시오.');
	}

	/**
	 * 웹툰 제목으로 고유값 조회.
	 * @param title 웹툰 제목
	 * @returns {Promise<WebToonException|*>}
	 */
	async getById(title) {
		return await this.service.getById(title);
	}

	/**
	 * 웹툰 제목으로 목록 조회
	 * @param title
	 * @returns {Promise<null>}
	 */
	async getByWebtoon(title) {
		return await this.service.getByWebtoon(title);
	}

}