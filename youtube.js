    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var showControl = true;
    var dulation;
    var HIGHRATE = 2;
    var LOWRATE = 1;
    var INTERVAL = 50;
    var player;
    var offset=0;
    var fff=0;//最初
    var eee=0;//最後
    var autoplay=0;
    var count=-1;//追加した
    var flag =0;
    function onYouTubeIframeAPIReady() {
      //var vid = 'd4Mu3CxaP-4';
      var vid = 'oyOJotQUfVs';//'wJddRdcr3BE';//'7Qgif5_6_Gg';
      var para = getUrlVars();
      if (para["v"])  vid = para["v"];
      if (para["autoplay"]) autoplay= para["autoplay"];
      if (para["off"]) {
        offset = para["off"];
      }
      if (para["ss"]) {
        LOWRATE = para["ss"];
      }
      if (para["ms"]) {
        HIGHRATE = para["ms"];
      }
      if (para["showctrl"]) {
        showControl = para["showctrl"];
      }
      setControl();
      setPerformance();

      document.getElementById('ss').addEventListener('change', function () {
        var newSs = document.getElementById('ss').value;
        document.getElementById('ss_value').value  = newSs;
        LOWRATE = newSs;
        first = true;
        setPerformance();
      })
      document.getElementById('ms').addEventListener('change', function () {
        var newMs = document.getElementById('ms').value;
        document.getElementById('ms_value').value  = newMs;
        HIGHRATE = newMs;
        first = true;
        setPerformance();
      })
      document.getElementById('offset').addEventListener('change', function () {
        var newOff = document.getElementById('offset').value;
        document.getElementById('offset_value').value  = newOff;
        offset = newOff;
        first = true;
        setPerformance();
      })

      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: vid,
        playerVars: { 'cc_load_policy': 1 , 'autoplay': autoplay},
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    //追加

    function onRadioButtonChange() {
      check1 = document.form.keep1.checked;
      check2 = document.form.keep2.checked;

      target = document.getElementById("output");
      console.log("mumu");

      if (check1 == true) {
        console.log("要素1がチェックされています。");
      }
      else if (check2 == true) {
        console.log("要素2がチェックされています。");
      }

    }

    //

    function setControl(){
      document.getElementById('offset').value  = offset;
      document.getElementById('offset_value').value  = offset;
      document.getElementById('ss').value  = LOWRATE;
      document.getElementById('ss_value').value  = LOWRATE;
      document.getElementById('ms').value  = HIGHRATE;
      document.getElementById('ms_value').value  = HIGHRATE;
      setControlVisible();
    }
    function setControlVisible(){
      console.log("control:" + showControl);
      if(showControl == true){
        document.getElementById('ctrl').style.display="block";
      }else{
        document.getElementById('ctrl').style.display="none";

      }
    }

    function onPlayerReady(event) {
      //event.target.playVideo();

      console.log(event.target.getVideoUrl())
      console.log(event.target.getAvailablePlaybackRates());
      getSub(event.target.getVideoUrl());
    }

    function getSub(url) {
      var a=new XMLHttpRequest(),b=url.match(/\?v=([-\w]{11})/)[1];
      a.onreadystatechange=function()
      {
        if(a.readyState==4&&a.status==200)
        {
          //console.log(a.responseXML.documentElement);
          var f=a.responseXML.documentElement.getElementsByTagName("track");
          if(f.length){
            var g=document.createElement("div"),e,d;
            g.style.cssText="padding:10px;background:white;border:1px solid #aaa;";
            g.onclick=function(){
              g.parentNode.removeChild(g);};

              var first = true;
              for(e=0;e<f.length;e++){
                d=document.createElement("button");
                d.type="button";d.innerHTML=f[e].getAttribute("lang_original");
                d.style.cssText="margin:3px;";
                d.value=f[e].getAttribute("lang_code");
                d.dataset.nm=f[e].getAttribute("name");
                //d.onclick=c;
                g.appendChild(d);

                if (first == true){
                  first = false;
                  getFirstSub(d);
                }
              }
              //document.getElementById("ctrl").appendChild(g);
            }else{
              if (!hasSubtitle){
                // alert("no subtitle!");
                getServerSub(url);
              }
            }
          }
          function getFirstSub(i){
            a.onreadystatechange=function(){
              if(a.readyState==4&&a.status==200){
                var j="",m,l=a.responseXML.documentElement.getElementsByTagName("p");
                for(m=0;m<l.length;m++){
                  //console.log(l[m]);
                  j+=m+1+"\n";
                  j+=h(Number(l[m].getAttribute("t")))+" --> "+h(Number(l[m].getAttribute("t"))+Number(l[m].getAttribute("d")))+"\n";
                  j+=l[m].innerHTML+"\n\n";
                }
                parseSrt(j);
                setPerformance();
                disableDropper();
              }
            };
            function h(l){
              var o=String(Math.floor(l/3600000)+100).substring(1);
              var j=String(Math.floor((l-o*3600000)/60000)+100).substring(1);
              var n=String(Math.floor((l-o*3600000-j*60000)/1000)+100).substring(1);
              var k=String(l+1000).slice(-3);
              return o+":"+j+":"+n+"."+k;
            }
            a.open("GET","https://www.youtube.com/api/timedtext?fmt=srv3&lang="+i.value+"&name="+i.dataset.nm+"&v="+b);
            a.send(null);
          }

          // function c(i){
          //   i.stopPropagation();
          //   a.onreadystatechange=function(){
          //     if(a.readyState==4&&a.status==200){
          //       var j="",m,l=a.responseXML.documentElement.getElementsByTagName("p");
          //       for(m=0;m<l.length;m++){
          //         //console.log(l[m]);
          //         j+=m+1+"\n";
          //         j+=h(Number(l[m].getAttribute("t")))+" --> "+h(Number(l[m].getAttribute("t"))+Number(l[m].getAttribute("d")))+"\n";
          //         j+=l[m].innerHTML+"\n\n";
          //       }
          //       // var k=new Blob([j],{type:"text/plain"});
          //       // var n=document.createElement("a");
          //       // n.href=URL.createObjectURL(k);
          //       // n.target="_blank";n.download=document.title+".srt";
          //       // g.appendChild(n).click();
          //       // URL.revokeObjectURL(k);
          //       parseSrt(j);
          //       setPerformance();
          //     }
          //   };
          //   function h(l){
          //     var o=String(Math.floor(l/3600000)+100).substring(1);
          //     var j=String(Math.floor((l-o*3600000)/60000)+100).substring(1);
          //     var n=String(Math.floor((l-o*3600000-j*60000)/1000)+100).substring(1);
          //     var k=String(l+1000).slice(-3);
          //     return o+":"+j+":"+n+"."+k;
          //   }
          //   a.open("GET","https://www.youtube.com/api/timedtext?fmt=srv3&lang="+i.target.value+"&name="+i.target.dataset.nm+"&v="+b);
          //   a.send(null);
          // }
        };
        a.open("GET","https://www.youtube.com/api/timedtext?type=list&v="+b);
        a.send(null);

    }

    function getServerSub(url){
      var a=new XMLHttpRequest(),b=url.match(/\?v=([-\w]{11})/)[1];
      a.onreadystatechange=function()
      {
        if(a.readyState==4&&a.status==200)
        {
          //console.log(a);
          var f=a.responseText;
          parseSrt(f);
          setPerformance();
          disableDropper();
        }else{
          if(!hasSubtitle){
            // alert("no subtitle!");
          }
        }
      };
      a.open("GET","https://2ff.azurewebsites.net/srt/"+b + ".srt");
      a.send(null);

    }

    function disableDropper(){
      document.getElementById("drop_zone_sub").style.display="none";
    }
    // var span = document.createElement('span');
    // span.innerHTML = '<div id="drop_zone_sub">Drop subtitle file (.srt) here</div>';
    // document.getElementById('list').insertBefore(span, null);

    var dropZoneSub = document.getElementById('drop_zone_sub');
    dropZoneSub.addEventListener('dragover', handleDragOver, false);
    dropZoneSub.addEventListener('drop', handleFileSelectSub, false);

    var done = false;
    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        setRate(state);
        timer = setInterval('checkRate()',INTERVAL);
        done = true;
      }else{
        //clearInterval(timer);
      }
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function handleFileSelectSub(evt) {

      evt.stopPropagation();
      evt.preventDefault();

      var f = evt.dataTransfer.files[0];

        var reader = new FileReader();
        reader.readAsText(f, "utf-8");
        reader.onload = function(evt){
          //console.log(evt.target.result);
          parseSrt(evt.target.result);
          setPerformance();
        }
        reader.onerror = function(evt){
          alert("Error ："+evt.target.error.code);
        }
       }




    var timer;
    var state = false;
    var first = true;
    function checkRate(){
      if (player.getPlayerState() == 1){
        var cur = player.getCurrentTime();
        //console.log(cur);//
        //console.log(player.getPlaybackRate());
        var newState = isInSub(cur,offset);//isInSubはかえる 残して違う関数
        if (state != newState || first){
          state = newState;
          first = false;
      setRate(state);
        }
        //変更点//
        var newSub = isWhichSub(cur,offset);
        var firsttime= -1;
        if (firsttime != newSub){
          var nowtime = newSub;
          setRate2(nowtime);
        }
      }
    }
    $(function(){
    	/*----------------
    	Ajax全般
    	----------------*/
    	//最小限
    	$.ajax({
    		url: "module.html"
    	}).done(function(data){ //ajaxの通信に成功した場合
    		alert("success!");
    		$(".example").html(data);
    	}).fail(function(data){ //ajaxの通信に失敗した場合
    		alert("error!");
    	});

    	//または
    	$.ajax({
    		url: "module.html"
    	}).then(function(data){ //ajaxの通信に成功した場合
    		alert("success!");
    		$(".example").html(data);
    	}, function(data){ //ajaxの通信に失敗した場合
    		alert("error!");
    	});


    	//主なオプション
    	$.ajax({
    		url: "https://api.voicetext.jp/v1/tts",
    		cache: false, //falseにすると、ajaxの内容をキャッシュしないようにする。defaultはtrue。省略可。
    		data: { //サーバーにGETで渡す情報。渡す必要がなければ省略可。
    			"text" : "おはようございます"
    		},
    		statusCode: { //HTTPコードが応答された場合に実行する内容を指定。必要なければ省略可。
    			404: function(){
    				alert("Page not found.");
    			}
    		},
    		type: "html", //xml, json, jsonp, text, script, htmlから該当のものを記入。省略した場合はxml,json,script,htmlから自動判別。空白区切りで複数指定可(その中から自動判別)。
    		user: "3kprkqhsdn3717nr:", //認証リクエストがある場合のユーザー名。認証がなければ省略可。
        //password: "futattio28" //認証リクエストがある場合のパスワード。認証がなければ省略可。
    	}).done(function(data, textStatus, jqXHR){
    		alert("success!");
    		$(".example").html(data);
    	}).fail(function(data, textStatus, errorThrown){
    		alert(textStatus); //エラー情報を表示
    		console.log(errorThrown.message); //例外情報を表示
    	}).always(function(data, textStatus, returnedObject){ //以前のcompleteに相当。ajaxの通信に成功した場合はdone()と同じ、失敗した場合はfail()と同じ引数を返します。
    		alert(textStatus);
    	});
    });

    function setRate2(st){
          if (st>count){
            $.ajax({
          		url: "https://api.voicetext.jp/v1/tts",
          		cache: false, //falseにすると、ajaxの内容をキャッシュしないようにする。defaultはtrue。省略可。
          		data: { //サーバーにGETで渡す情報。渡す必要がなければ省略可。
          			"text" : "おはようございます",
                "speaker" : "show"
          		},
              beforeSend: function(xhr) {
                //var credentials = $.base64.encode("username:3kprkqhsdn3717nr:");
                xhr.setRequestHeader("Authorization", "Basic " + "username:3kprkqhsdn3717nr");
              },
          		statusCode: { //HTTPコードが応答された場合に実行する内容を指定。必要なければ省略可。
          			404: function(){
          				alert("Page not found.");
          			}
          		},
          		type: "POST", //xml, json, jsonp, text, script, htmlから該当のものを記入。省略した場合はxml,json,script,htmlから自動判別。空白区切りで複数指定可(その中から自動判別)。
          		//user: "3kprkqhsdn3717nr", //認証リクエストがある場合のユーザー名。認証がなければ省略可。
              //user: "futattio28",//認証リクエストがある場合のパスワード。認証がなければ省略可。
              Origin: "test.wav"
          	})
            /*
            .done(function(data, textStatus, jqXHR){
          		alert("success!");
          		$(".example").html(data);
          	}).fail(function(data, textStatus, errorThrown){
          		alert(textStatus); //エラー情報を表示
          		console.log(errorThrown.message); //例外情報を表示
          	}).always(function(data, textStatus, returnedObject){ //以前のcompleteに相当。ajaxの通信に成功した場合はdone()と同じ、失敗した場合はfail()と同じ引数を返します。
          		alert(textStatus);

          	});
            */
            /*console.log(st+" "+subList[st]);
            console.log(subList[st].length);
            count++;
            var u = new SpeechSynthesisUtterance();
            u.text = subList[st];
            u.lang = 'ja-JP';
            //u.lang = 'en-US';
            u.rate=LOWRATE+subList[st].length*0.008;
            console.log(LOWRATE+subList[st].length*0.008);
            //u.rate = LOWRATE+0.3;
            var nowVolum = player.getVolume();
            player.setVolume(nowVolum);
            var startTime,endTIme;
            u.onstart=function(event){
              flag=0;
              startTime = new Date();
            console.log(flag);
          player.playVideo();}//
            u.onend = function(event)
            {
             //alert('Finished in ' + event.elapsedTime + ' seconds.');*/
             //console.timeEnd("a");
             /*endTime = new Date();
             console.log((endTime - startTime)/1000 + "s");
             flag=1;
             console.log(flag);
           //console.log('Finished in ' + event.elapsedTime + ' seconds.');
         }
            player.setVolume(10);//読み上げ終了時点
            speechSynthesis.speak(u);//speachする
            console.log("aaaa "+flag);
            if(flag==0)player.pauseVideo();//??????????????一時停止
          //  else player.playVideo();/////???????????再開
*/
        }
      }

        //ここまで

    function setRate(st){
      if (st){
        player.setPlaybackRate(LOWRATE);
        console.log("in sub");
        document.getElementById("ff").checked = false;
      }else{
        player.setPlaybackRate(HIGHRATE);
        console.log("out sub");
        document.getElementById("ff").checked = true;
      }

    }

    function setPerformance(){
      if(player && player.getDuration){
        var dur = player.getDuration() * 1000;
        if (dur > 0){
          var newDuration = getNewDuration(HIGHRATE,LOWRATE,offset,dur);
          //var newDuration = totalSubTime / LOWRATE + (dur - totalSubTime) / HIGHRATE;
          var earned = Math.floor(newDuration[1]);
          var perc = Math.floor(100 - newDuration[2]);

          var msg = "[Reduced " + perc + "% (" +
          formatDate(newDuration[3], 'hh:mm:ss')
          +  ")]";
          document.getElementById("performance").innerHTML = msg;
          // "[Reduced into " +
          //   //newDuration + "/" + dur + " :" +
          //   perc + "% (Earned " + earned +" sec.)]";
        }
      }
    }
