// JSKANG Library
const kjsDate = require("./lib/JSKangDate");
const kjsSchedule = require("./lib/JSKangSchedule");
const kjsSF1v7= require("./lib/JSKangSF1v7");

// Slack Bot Library
const { RTMClient } = require("@slack/rtm-api");
const { WebClient } = require("@slack/web-api");
const token = "token";
const rtm = new RTMClient(token);
const web = new WebClient(token);

// Node JS Library
const schedule = require('node-schedule');

// Plugin load
const fs = require('fs');
fs.readdir("./plugin", (err, files) => {
	if (files) {
		files.forEach( file => {
			// TODO 챗봇전용 플러그인은 구현안됨
			console.info("[" +file+ "] Plugin load.");
			try {
				let plugin = require("./plugin/" +file);
				plugin.run();
				console.info("[" +file+ "] Plugin run success.");
			} catch(error) {
				console.error("[" +file+ "] Plugin run fail.");
				console.debug(error);
			}
		});
	}
});

var runchMenu = [ 
	"훠궈야", "수제버거집", "우테이블", "계란집", "베이징스토리", "마키노차야", "빕스",
        "스시가오", "스시쿤", "청년다방", "서호돈까스", "통통낙지마을", "비와별닭갈비", "돈돈정",
        "하나스시", "웰스토리(구내식당)", "한컴식당(구내식당)", "생어거스틴", "봉피양", "홍대돈부리",
        "담소사골순대", "스시선", "박가부대찌개", "포베이", "차알"
]

function UserSelect( user ){
        switch ( user ){
                case "U02P85E6QQ3": return "짱구";
                case "U014D0ZK876": return "맹구";
                case "U0146R4N142": return "훈";
                case "U01B80A06AY": return "유리";
                case "U0171F2NFH6": return "철수";
        };
}

function MessageSend( msg, channel ){
	rtm.sendMessage( msg, channel );
}

// 출근 시간
schedule.scheduleJob(kjsSchedule.openTime(), function(){
    (async () => {
 	    MessageSend(kjsSchedule.openText(), "C0145DT13M3");
    })();
});

// 점심 시간
schedule.scheduleJob(kjsSchedule.lunchTime(), function(){
    (async () => {
	    MessageSend(kjsSchedule.lunchText(), "C0145DT13M3");
    })();
});

// 쉬는 시간
schedule.scheduleJob(kjsSchedule.breakTime(), function(){
    (async () => {
	    MessageSend(kjsSchedule.breakText(), "C0145DT13M3");
    })();
});

// 퇴근 시간
schedule.scheduleJob(kjsSchedule.closeTime(), function(){
    (async () => {
	    MessageSend(kjsSchedule.closeText(), "C0145DT13M3");
    })();
});

rtm.on("message", async event => {
	// 꾸물이는 로직 처리 안함
	if (event.user == "U029TGXFS9E"){
		return;
	}

	let fileDownloadUrl = "";
	if (event.files){
		for(let file in event.files){
			fileDownloadUrl += event.files[file].url_private_download+ " ";
		}
	}

	let channel = event.channel;
	let text = event.text;
	let ts = event.ts ? event.ts : 0;

	if (event.bot_profile != null ){
		return;
	}

	let response = [];
	let randomNum = 0;

	let toDay = kjsDate.getDate(ts*1000);
	let toDayTime = kjsDate.getDateTime(ts*1000);

	if ( !event.deleted_ts ) {
		// 채팅기록 불러오기를 위한 변수
		let command = text.match(/!채팅기록 ([0-9]){8}/g);
		if (command){
			text = "!채팅기록";
		}

		if (text == "!채팅기록"){
			// TODO: 채팅기록DB에서 조회 후 슬랙 채팅 전송
			// web.files.upload(result);
		} else if (text == "!명령어" || text == "!help" || text == "!도움말"){
			MessageSend(
				"*반드시 맨앞에 느낌표를 붙이셔야 꾸물이 명령어가 사용됩니다.*\n"+
				" 1. `!채팅기록 {날짜}` : 원하는 날짜의 채팅 기록을 모두 불러옵니다.\n"+
				"(example-1) `!채팅기록 20211201`이라고 명령하면 2021년 12월 1일의 채팅기록을 불러올 수 있습니다.\n\n"+
				" 2. `!점심메뉴` : 회사근방에 있는 점심 메뉴를 추천받을 수 있습니다.\n"+
				"========== 끝 ==========\n"
				, channel);
		} else if ( text == "!점심메뉴" ){
                        let menu = runchMenu[ Math.round( (Math.random() * 1000) ) % ( runchMenu.length-1 ) ];
			MessageSend("점심 메뉴는 " +menu+ "을(를) 추천드립니다.", channel);
		} else {
			// TODO: 채팅기록DB 저장
		}
	} 
});


(async () => {
  await rtm.start();
})();
