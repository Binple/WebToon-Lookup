'use strict';

export default class LookupReq {

	constructor(body) {
		this._portal = body.portal; // 포털 이름
		this._toon = body.toon;
		this._body = body; // 웹툰 이름
	}

	get portal() {
		return this._portal;
	}

	set portal(value) {
		this._portal = value;
	}

	get toon() {
		return this._toon;
	}

	set toon(value) {
		this._toon = value;
	}
}