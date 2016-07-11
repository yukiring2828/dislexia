    var showControl = true;
    var HIGHRATE = 4.0;
    var LOWRATE = 1;
    var INTERVAL = 50;
    var offset=0;
    var para = getUrlVars();
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

    var done = false;
    function handleFileSelect(evt) {

      evt.stopPropagation();
      evt.preventDefault();

      var URL = URL || webkitURL;
      for (var i = 0;i<evt.dataTransfer.files.length;i++){
             var file = evt.dataTransfer.files[i];
             if (file.type == "video/mp4"){
               console.log("mp4 dropped");
               var span = document.createElement('span');
               // span.innerHTML = ['<video id="Video1" ><source src="',
               // URL.createObjectURL(file),
               // '" type="video/mp4" /></video>'].join('');

               span.innerHTML = ['<video id="Video1" class="video-js" controls preload="auto"',
//                  'width="640" height="480" data-setup="{}"',
                  ' width="640" data-setup="{}"',
                  '><source src="',
                   URL.createObjectURL(file),
                   '" type="video/mp4"></video>'].join('');

               document.getElementById('list').insertBefore(span, null);

               setRate(state);
               timer = setInterval('checkRate()',INTERVAL);
               done = true;

               document.getElementById('drop_zone').style.display="none";
             }else if (file.name.match(/.srt/)){
               console.log("srt dropped");
               var reader = new FileReader();
               reader.readAsText(file, "utf-8");
               reader.onload = function(evt){
                 //console.log(evt.target.result);
                 parseSrt(evt.target.result);

               }
               reader.onerror = function(evt){
                 alert("Error ："+evt.target.error.code);
               }

             }
      }
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);


    var timer;
    var state = false;
    var first = true;
    function checkRate(){
      var video = document.getElementById("Video1");
      // video.currentTime is in seconds.
      var newState = isInSub(video.currentTime,offset);
      if (state != newState || first){
        state = newState;
        first = false;
        setRate(state);
      }

    }
    function setRate(st){
      var video = document.getElementById("Video1");
      if (st){
        video.playbackRate = LOWRATE;
        console.log("in sub");
        document.getElementById("ff").checked = false;
      }else{
        video.playbackRate = HIGHRATE;
        console.log("out sub");
        document.getElementById("ff").checked = true;
      }
      console.log(video.playbackRate);
    }

    function setPerformance(){
      var video = document.getElementById("Video1");
      if(video){
        var dur = video.duration * 1000;
        //console.log(dur);
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
