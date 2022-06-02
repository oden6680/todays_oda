const CALENDAR_ID = 'googleカレンダーのID(利用しているgoogleアカウントと同じ)';
const WEBHOOK_URL = 'discordのWebHookURL';
 
const main = () => {

  let calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  let message = "<@メンションしたいユーザーのID>\n" + Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');

  let events = calendar.getEventsForDay(new Date());

  if(events.length > 0) {
    message += " のおでんの予定だよ！" + "\n ------------------------------------------------------------ \n";
  } else {
    message += " のおでんの予定はないよ！暇だね！"
  }

  for(j in events) {
    let event = events[j];
    let title = event.getTitle();
    let start = toTime(event.getStartTime());
    let end = toTime(event.getEndTime());
    message += start + ' - ' + end + " " + title + '\n';
  }

  if(events.length > 0) {
    message += "------------------------------------------------------------- \n";
  }

  const payload = {
    username: "今日のおでん",
    content: message,
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  });
}

//GASで毎日同じ時間にプログラムを実行するトリガーが設定できないので、プログラムを走らせた時に次のトリガーを自動で設定する必要がある
//以下はトリガー設定用の関数
const setTrigger = () => {
  let triggerDay = new Date();
  triggerDay.setDate(triggerDay.getDate() + 1)
  triggerDay.setHours(0);
  triggerDay.setMinutes(00);

  ScriptApp.newTrigger("main")
      .timeBased()
      .at(triggerDay)
      .create();
}
 
const toTime = (str) => {
  return Utilities.formatDate(str, 'JST', 'HH:mm');
}