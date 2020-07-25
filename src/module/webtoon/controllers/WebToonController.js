import LookupService from "../services/LookupService";
import LookupReq from "../models/LookupReq";

const lookupService = new LookupService();

export default class WebToonController {

	async getList(req, res, next) {
		let lookupReq = new LookupReq(req.body); // 요청 Body 를 클래스로 변환

		try {
			// 요청 portal 설정
			lookupService.portal = lookupReq.portal;

			// 목록을 가져와 리턴
			let result = await lookupService.getByWebtoon(lookupReq.toon)

			return res.json(result);
		} catch (e) {
			// 에러 발생시 에러 정보 리턴
			console.log('--- ERROR ---');
			console.log(e);
			return res.status(e.status).json(e);
		}
	}
}
