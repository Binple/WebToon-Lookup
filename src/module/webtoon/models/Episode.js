'use strict';

// 에피소드 클래스
export default class Episode {

	constructor(title = '', rating = 0, count = 0, regDate = '') {
		this.title = title; // 에피소드 제목

		// Naver: 조회 시점 기준 회차 평점
		// Daum: 조회 시점 기준 작품 평점
		this.rating = rating;

		// Naver: 평점에 참여한 인원수
		// Daum: 해당 에피소드의 추천수
		this.count = count;

		// 에피소드 등록
		this.regDate = regDate;
	}

}