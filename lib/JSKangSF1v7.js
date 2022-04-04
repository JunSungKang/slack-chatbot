const axios = require('axios');
const fs = require('fs');

function getQuery(channel, date) {
	// 특정 채널 전체 조회
	let q = {
		"paging": {
			"from": 0,
			"size": 10000
		},
		"query": {
			"bool": {
				"must": [
					{
						"match": {
							"CHANNEL": channel
						}
					}
				]
			}
		},
		"sorting": [
			{
				"fieldName": "DATE",
				"reverse": true
			}
		],
		"truncation": true,
		"spellChecker": 0
	};

	// 특정 날짜 쿼리 생성
	if (date) {
		q.query.bool["filter"] = [
			{
				"date_range": {
					"DATE": {
						"startDate": date+ "000000",
						"endDate": date+ "235959"
					}
				}
			}
		];
	}

	return q;
}

exports.index = (chating) => {
	axios.post("http://127.0.0.1:9001/index/ctr/multiple/insert", chating)
		.then(res => {})
		.catch(error => { console.error("[ERROR-DocumentIndex]: " +error) });

}

exports.search = async (command, channel) => {
	if (!command) {
		return;
	}

	let date = command[0].substring(6,14);
	console.log(date);
	let query = getQuery(channel, date);
	return await axios.post("http://127.0.0.1:9001/search/ctr", query)
		.then(res => {
			let message = "";
			for (let i in res.data["document"]){
				message += "[" +res.data["document"][i]["fields"]["DATE"]+ "] ";
				message += "[" +res.data["document"][i]["fields"]["WRITER"]+ "] ";
				message += res.data["document"][i]["fields"]["CONTENT"]+ "\n";
				if (res.data["document"][i]["fields"]["FILE"]) {
					message += res.data["document"][i]["fields"]["FILE"].replace(" ", "\n");
					message += "\n";
				}
			}
			
			let chatLogFileName = "/data/SlackBots/Kkumul/chatLog/chat-" +date+ ".txt";
			fs.writeFile(chatLogFileName, message, 'utf8',  function() {
				console.info("[INFO] " +date+ " 날짜의 채팅기록을 생성합니다.")
			});

			return {
                                title: date+ " 날짜의 채팅기록",
                                filename: date+ "-chat-log.txt",
                                channels: channel,
                                initial_comment: "요청하신 채팅기록입니다.",
                                comment: "",
                                file: fs.createReadStream(chatLogFileName)
                        };
		})
		.catch( error => console.log(error) );
}
