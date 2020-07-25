'use strict';

import Axios from 'axios'; // http 호출 모듈
import moment from 'moment'; // 날짜 모듈

import WebToonException from '../models/WebToonException';
import LookupRes from '../models/LookupRes';
import Episode from '../models/Episode';


// 기본으로 호출할 다음 웹툰 주소
const callUrl = 'http://webtoon.daum.net/';

// 헤더 기본 설정
const axios = Axios.create({
	headers: {
		'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0',
	}
});
/**
 * 다음 : 무료로 열람 가능한 최근5회의 각 제목, 등록일, 조회시점의 작품 평점, 추천수
 */
export default class LookupDaumService {

	// 웹툰 제목으로 고유값 조회.
	async getById(title) {

		let response = await axios.get(callUrl + 'data/pc/search', {
			params: {
				q: title,
				page_no: 1,
			}
		});

		// 없으면 에러 메시지 표시
		if (response.data.data.webtoon === null) {
			throw new WebToonException(400, '올바른 웹툰 이름을 입력하여 주십시오');
		}

		// 목록이 있으면 입력한 제목과 웹툰의 이름이 맞다면 웹툰의 객체를 추출
		let webtoon = response.data.data.webtoon.find(webtoon => webtoon.title === title);

		// 추출된 웹툰이 없으면 에러 리턴
		if (typeof webtoon === 'undefined') {
			throw new WebToonException(400, '올바른 웹툰 이름을 입력하여 주십시오');
		}

		if (webtoon.ageGrade >= 19) {
			throw new WebToonException(403, '해당 웹툰은 성인만 확인 가능 합니다.');
		}

		return webtoon.nickname;
	}

	// 웹툰 제목으로 목록 조회
	async getByWebtoon(title) {

		// 웹툰의 고유값을 가져 온다.
		let id = await this.getById(title);

		// 웹툰 목록 요청
		let response = await axios.get(callUrl + 'data/pc/webtoon/view/' + id);

		// 리턴할 클래스 생성
		let lookupRes = new LookupRes('DAUM', title, []);

		// 날짜 최신 순으로 에피소드 목록을 정렬
		let episodeList = response.data.data.webtoon.webtoonEpisodes.sort(function (a, b) {
			return b.dateCreated - a.dateCreated;
		});

		// 유료인 에피소드 제거
		episodeList = episodeList.filter(episode => episode.price === 0);

		let list = [];

		// 5개 목록만 추출
		for (let i = 0; i < 5; i++) {
			let episode = new Episode();
			episode.title = episodeList[i].title; // 에피소드 제목
			episode.rating = response.data.data.webtoon.averageScore.toFixed(1); // 작품 평점 소숫점 첫째자리까지 보여 주며 반올림
			episode.count = episodeList[i].voteTarget.voteCount; // 추천수
			episode.regDate = moment(episodeList[i].dateCreated, 'YYYY-MM-DD').format('YYYY-MM-DD'); // 등록일
			list.push(episode);
		}
		// 리턴할 클래스에 에피소드 목록 넣음
		lookupRes.episodeList = list;

		return lookupRes;
	}
}