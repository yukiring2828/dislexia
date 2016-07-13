// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
//alert('ok');
} else {
  alert('The File APIs are not fully supported in this browser.');
}

var getUrlVars = function(){
    var vars = {};
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURI(val);
    }
    return vars;
}
//console.log(getUrlVars());

var hasSubtitle = false;
var sTimeList = [];
var eTimeList = [];
var subList = [];
var totalSubTime = 0;
function parseSrt(srt) {
  sTimeList = [];
  eTimeList = [];
  subList = [];

  var i=0;
  var lines = srt.split('\n');//字幕データ
  do{
    if (lines[i] == '')break;
    //lines[i] is a number
    // console.log(lines[i]);
    i++;
    //lines[i] is a timespan
    var time = parseTimeSpan(lines[i]);
    sTimeList.push(time[0]);
    eTimeList.push(time[1]);
    totalSubTime += (time[1]-time[0]);
    var sub = '';
    i++;
    do{
      //lines[i] is a sub
      sub += lines[i] + '\n';
      i++;
    }while(i<lines.length && lines[i] != '');
    subList.push(sub);
    //console.log(lines[i]);
    i++;
  } while (i<lines.length);
  if (srt.length>0){
    console.log("subtitles loaded.");
    hasSubtitle = true;
  }

}
function parseTimeSpan(tm) {
  var t = tm.split(" --> ");
  var time = [parseTime(t[0]), parseTime(t[1])];
  return time;
}
function parseTime(t){
  //      00:02:09,230
  //      var d = new Date(2012, 0, 30, 14, 29, 50, 500);
  var d = t.replace(".",",").split(",");
  var d2 = d[0].split(":");
  var dat = new Date(0,0,0,parseInt(d2[0]),parseInt(d2[1]),parseInt(d2[2]) ,parseInt(d[1]));
  // console.log(dat.getHours());
  // console.log(dat.getMinutes());
  // console.log(dat.getSeconds());
  // console.log(dat.getMilliseconds());
  return dat.getTime();
}
var ref = new Date(0,0,0,0,0,0,0).getTime();
function isInSub(time,offset){//iは字幕 何度も同じ字幕になる
  var tt = ref + time*1000;
  var at=-1;
  for(var i=0;i<sTimeList.length;i++){
    if (sTimeList[i]-offset<=tt && tt < eTimeList[i]) {
      //console.log(subList[st]);
      return true;//今のままだと同じ字幕をずっと読み込む

    }
  }
  return false;
}

//追加
function isWhichSub(time,offset){
  var tt = ref + time*1000;
  var at = -1
  for(var i=0;i<sTimeList.length;i++){
    if (sTimeList[i]-offset<=tt && tt < eTimeList[i]) {
      return i; //字幕番号
    }
  }
  //console.log(subList[st]);
  return at; //入ってない時
}

//ここまで


function getNewDuration(ms,ss,offset,dur){
  //return totalSubTime / ss + (dur - totalSubTime) / ms;
  var first=true;
  var teTimeList = [];
  var tsTimeList = [];
  for(var i=0;i<sTimeList.length;i++){
    tsTimeList.push(sTimeList[i]);
    teTimeList.push(eTimeList[i]);
    if (first == true) {
      first = false;
      continue;
    }
    var int = sTimeList[i] - eTimeList[i-1];
    if (offset > int){
      tsTimeList.push(eTimeList[i-1]);
      teTimeList.push(sTimeList[i]);
    }else{
      tsTimeList.push(sTimeList[i]-offset);
      teTimeList.push(sTimeList[i]);
    }
  }
  var ttotalSubTime=0;
  for(var i=0;i<tsTimeList.length;i++){
    ttotalSubTime += (teTimeList[i]-tsTimeList[i]);
  }
  //console.log(ttotalSubTime + " " + totalSubTime);
  var newDuration = ttotalSubTime / ss + (dur - ttotalSubTime) / ms;
  var earned = (dur - newDuration) / 1000;
  var percent = newDuration / dur * 100;

  var d = new Date(0);
  var utc = d.getTimezoneOffset() * 60000;
  var nd = new Date(utc + newDuration);

  return [newDuration,earned,percent,nd];
}

var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};
