var url = "";
var checkUrl = function() {
  var newUrl = location.href;
  //console.log("url check");
  if (url != newUrl){
    url = newUrl;
    console.log("url changed");
    //var timer = setTimeout('getSub(url)',2000);
    if (url.match(/watch\?v=([-\w]{11})/)){
      getSub(url);
    }
  }
  setTimeout('checkUrl()',1000);
}
checkUrl();

var navUrl = "";
function getSub(url) {
  var a=new XMLHttpRequest(),b=url.match(/\?v=([-\w]{11})/)[1];
  a.onreadystatechange=function()
  {
    if(a.readyState==4&&a.status==200)
    {
      //console.log(a.responseXML.documentElement);
      var f=a.responseXML.documentElement.getElementsByTagName("track");
      if(f.length){
        navUrl = "http://2ff.azurewebsites.net/youtube.html" + url.match(/\?v=([^&]+)/)[0] + "&autoplay=1&ss=1.5&ms=2.0";

        if (!Notify.needsPermission) {
          doNotification();
        } else if (Notify.isSupported()) {
          Notify.requestPermission(onPermissionGranted, onPermissionDenied);
        }

        // myRet = confirm("Do you acceralate your watching with iFF?");
        // if ( myRet == true ){
        //   window.open(navUrl);
        //   //location.href = navUrl;
        // }else{
        // }
      }else{
        //alert("no subtitle!");
      }
    }
  };
  a.open("GET","https://www.youtube.com/api/timedtext?type=list&v="+b);
  a.send(null);
}

////////
//
function onPermissionGranted () {
  console.log('Permission has been granted by the user');
  doNotification();
}
function onPermissionDenied () {
  console.warn('Permission has been denied by the user');
}

function doNotification () {
  function onShowNotification () {
    console.log('notification is shown!');
  }
  function onCloseNotification () {
    console.log('notification is closed!');
  }
  function onClickNotification () {
    console.log('notification was clicked!');
      //window.open(navUrl);
      location.href = navUrl;
      myNotification.close();

  }
  function onErrorNotification () {
    console.error('Error showing notification. You may need to request permission.');
  }
  var myNotification = new Notify('2FF Youtube viewer is available for this video!', {
    body: 'Click here to acceralate your watching.',
    tag: 'iFF',
    icon: 'http://2ff.azurewebsites.net/icons/icon_128.png',
//    icon: '/icons/icon_048.png',
    notifyShow: onShowNotification,
    notifyClose: onCloseNotification,
    notifyClick: onClickNotification,
    notifyError: onErrorNotification,
    timeout: 8
  });
  myNotification.show();
}
