'use strict';
export default class WebToonException {

	constructor(status, message) {
		this.status = status; // 상태 코드
		this.message = message; // 메시지
	}
}