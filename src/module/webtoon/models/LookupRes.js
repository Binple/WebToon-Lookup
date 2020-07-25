'use strict';

export default class LookupRes {

	constructor(portal = '', toon = '', episodeList = []) {
		this.portal = portal; // 웹툰 포털
		this.toon = toon; // 웹툰 제목
		this.episodeList = episodeList; // 웹툰 목록
	}

}