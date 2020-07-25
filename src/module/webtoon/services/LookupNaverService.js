'use strict';

import Axios from 'axios'; // http 호출 모듈
import moment from 'moment'; // 날짜 모듈
import cheerio from "cheerio"; //cheerio 모듈

import WebToonException from '../models/WebToonException';
import LookupRes from '../models/LookupRes';
import Episode from '../models/Episode';

// 기본으로 호출할 네이버 웹툰 주소
const callUrl = 'https://m.comic.naver.com/';

// 헤더 기본 설정
const axios = Axios.create({
	headers: {
		'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0',
	}
});

export default class LookupNaverService {

	// 웹툰 제목으로 고유값 조회.
	async getById(title) {

		let response = await axios.get(callUrl + 'search/result.nhn', {
			params: {
				keyword: title,
			}
		});

		let $;
		// 응답이 정상 이라면
		if (response.status === 200) {
			$ = cheerio.load(response.data);
		}

		// 파싱된 html 에서 검색한 웹툰 제목과 실제 목록에 나오는 웹툰 제목이 같다면 해당 웹툰의 id를 추출 한다.
		let id;  // 웹툰 고유 ID
		let isAdult; // 성인 웹툰 여부;
		$('article.result_lst ul.toon_lst > li').each(function (i, element) {

			$(this).closest('article.result_lst').find('h3.tit_result > em').remove();

			// 웹툰이 아니면 종료
			if ($(this).closest('article.result_lst').find('h3.tit_result').text().trim() !== '웹툰') {
				return false;
			}

			// 웹툰 고유값을 가져옴
			if ($(this).find('div.toon_info span.toon_name').text() === title) {

				// 웬툰 고유값
				id = $(this).find('a').attr('href').replace('/webtoon/list.nhn?titleId=', '');

				// 성인 웹툰 인지 체크
				isAdult = $(this).find('span').hasClass('adult_s');

				return false;
			}
		});

		// 웹툰 고유값이 있는지 확인
		if (typeof id === 'undefined' || id === '' || id === null) {
			throw new WebToonException(400, '올바른 웹툰 이름을 입력하여 주십시오');
		}

		// 성인 웹툰일 경우 에러 메시지 표시
		if (isAdult) {
			throw new WebToonException(403, '해당 웹툰은 성인만 확인 가능 합니다.');
		}

		return id;
	}

	// 웹툰 제목으로 목록 조회
	async getByWebtoon(title) {

		// 웹툰의 고유값을 가져 온다.
		let id = await this.getById(title);

		// 웹툰 목록 요청
		let response = await axios.get(callUrl + 'webtoon/list.nhn', {
			params: {
				titleId: id,
				sortOrder: 'DESC',
			}
		});

		// 리턴할 클래스 생성
		let lookupRes = new LookupRes('NAVER', title, []);

		let $;
		// 응답이 정상 이라면
		if (response.status === 200) {
			$ = cheerio.load(response.data);
		}

		let list = [];

		$('ul.section_episode_list > li').each(function (i, element) {
			let episode = new Episode();
			episode.title = $(this).find('strong.title > span.name > strong').text(); // 에피소드 제목
			episode.rating = $(this).find('div.detail > span.score').text(); // 작품 평점 소숫점 첫째자리까지 보여 주며 반올림
			episode.regDate = moment($(this).find('div.detail > span.date'), 'YY-MM-DD').format('YYYY-MM-DD'); // 등록일
			episode.no = $(this).attr('data-no');
			list.push(episode);

			// 5개만 채우고 빠져나감
			if (i >= 4) {
				return false;
			}
		});

		// 해당 에피소드의 평점 참여자수 가져오기
		for (let i = 0; i < list.length; i++) {
			list[i].count = await this.getByRatingCount(id, list[i].no);
			delete list[i].no;
		}

		// 리턴할 클래스에 에피소드 목록 넣음
		lookupRes.episodeList = list;

		return lookupRes;
	}

	// 해당 에피소드의 평점 참여자수 가져오기
	async getByRatingCount(id, no) {
		// 웹툰 정보 요청
		let response = await axios.get(callUrl + 'webtoon/detail.nhn', {
			params: {
				titleId: id,
				no: no,
				sortOrder: 'DESC',
			}
		});

		let $;
		// 응답이 정상 이라면
		if (response.status === 200) {
			$ = cheerio.load(response.data);
		}

		let count = $('div.info_score > span#starUser').text().replace('명 참여', '');

		return count * 1;
	}

}