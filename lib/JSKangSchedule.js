const schedule = require('node-schedule');

exports.openTime = () => {
	let scheduleTime = new schedule.RecurrenceRule();
	scheduleTime.dayOfWeek = new schedule.Range(1,5);
	scheduleTime.hour = 9;
	scheduleTime.minute = 0;
	scheduleTime.second = 0;
	return scheduleTime;
}

exports.lunchTime = () => {
	let scheduleTime = new schedule.RecurrenceRule();
        scheduleTime.dayOfWeek = new schedule.Range(1,5);
        scheduleTime.hour = 11;
        scheduleTime.minute = 50;
        scheduleTime.second = 0;
        return scheduleTime;
}

exports.breakTime = () => {
	let scheduleTime = new schedule.RecurrenceRule();
        scheduleTime.dayOfWeek = new schedule.Range(1,5);
        scheduleTime.hour = 16;
        scheduleTime.minute = 0;
        scheduleTime.second = 0;
        return scheduleTime;
}

exports.closeTime = () => {
	let scheduleTime = new schedule.RecurrenceRule();
        scheduleTime.dayOfWeek = new schedule.Range(1,5);
        scheduleTime.hour = 18;
        scheduleTime.minute = 0;
        scheduleTime.second = 0;
        return scheduleTime;
}

exports.openText = () => {
	return  "좋은 아침이에요. 오늘의 포춘QR를 휴대폰 카메라를 통해서 확인해보세요!\n"
		+ "https://qrcodethumb-phinf.pstatic.net/20201211_52/1607648431087WPa3G_PNG/0JgTL.png\n"
		+ "그럼 오늘 하루도 즐거운 하루 되세요 !";
}

exports.lunchText = () => {
	return "또도독~! 여러부운~ 점심 맛있게드세요!\n"
		+ "`!점심메뉴` 를 입력하면 제가 점심메뉴를 추천해드릴게요.";
}

exports.breakText = () => {
	let today = new Date();
	dayLabel = today.getDay();

	let msg = "`!도움말` 을 입력해서 꾸물이와 함께 놀아보아요~\n";

	// 금요일만 발송
	if ( dayLabel == 5 ) {
		return msg+ "그리고 오늘은 금요일이니깐 퇴근하기전에 다음주 시프티 요청해주세요 ~\n";
	}
	return msg;
}

exports.closeText = () => {
	return "띵동-! 오늘 하루도 고생 많으셨습니다. 맛있는 저녁드시고 마무리 잘하세요.";
}
