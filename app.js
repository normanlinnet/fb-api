(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-22640517-1', 'auto');
ga('send', 'pageview');


window.fbAsyncInit = function() {
  FB.init({
    appId: '252632974766472', // App ID
    channelUrl: 'http://moesh.tw/channel.html', // Channel File
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true // parse XFBML
  });


  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
      document.getElementById("message").innerHTML += "<br>Connected to Facebook";
      //SUCCESS

    } else if (response.status === 'not_authorized') {
      document.getElementById("message").innerHTML += "<br>Failed to Connect";

      //FAILED
    } else {
      document.getElementById("message").innerHTML += "<br>Logged Out";

      //UNKNOWN ERROR
    }
  });

};

function Login() {

  FB.login(function(response) {
    if (response.authResponse) {
      getUserInfo();
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {
    scope: 'email,user_photos,user_videos'
  });


}

function getUserInfo() {
  FB.api('/me', function(response) {
    var str = "<b>Name</b> : " + response.name + "<br>";
    str += "<b>Link: </b>" + response.link + "<br>";
    str += "<b>Username:</b> " + response.username + "<br>";
    str += "<b>id: </b>" + response.id + "<br>";
    str += "<b>Email:</b> " + response.email + "<br>";
    str += "<input type='button' value='Get Photo' onclick='getPhoto();'/>";
    str += "<input type='button' value='Logout' onclick='Logout();'/>";
    str += "<input id='page' value='myudn' type='text' >";
    str += "<input type='button' onclick=getFanInfo('myudn');/>";

    document.getElementById("status").innerHTML = str;

  });
}

var fanCommentPosts = {};
var fanCommentPosts2 = {};
var loadPageNum = 0;
var announce = 0;

function getFanInfo(page) {
  announce = 0;
  document.getElementById("status").innerHTML = "";
  document.getElementById("status2").innerHTML = "";
  if (page == "test") {
    page = document.getElementById("page").value;
  }
  var getUrl = '/' + page + '/posts?fields=story,status_type,story_tags,full_picture,created_time,id,message&limit=50&access_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';
  FB.api(getUrl, function(response) {
    var str = "";
    for (var key in response.data) {

      getComment(page, response.data[key].message, response.data[key].id);


    }
    //document.getElementById("status2").innerHTML+=str;
    announce = 1;

  });
  if (announce == 1) {
    alert("done");
  }



  document.getElementById("ayn").innerHTML = "<input type='button' onclick='countMembers();' value='分析專頁留言'/>";

}

function getComment(page, message, postid) {

  var getUrl = '/' + postid + '/commentsaccess_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';
  //alert(getUrl);
  var content = message;

  var getUrl = '/' + postid + '/comments?limit=1000&access_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';
  FB.api(getUrl, function(response) {

    for (var key in response.data) {
      document.getElementById("members").value = response.data[key].from.id + ',' + document.getElementById("members").value;
      fanCommentPosts[response.data[key].from.id] += '<tr><td>' + response.data[key].created_time + '</td><td><a href=https://facebook.com/' + response.data[key].id + '>' + response.data[key].message + '</a></td><td>(' + content + ')</td><td>[' + page + ']</td></tr>';
      fanCommentPosts2[response.data[key].from.id] = response.data[key].from.name;
    }


  });



}

function countMembers() {
  announce = 0;
  document.getElementById("message").innerHTML = "wait...";
  document.getElementById("status2").innerHTML = "";
  var mem = document.getElementById("members").value;
  var arr = new Array();
  var arr = mem.split(",");

  var result = {};
  for (var key in arr) {
    count = (mem.split(arr[key]).length) - 1;
    result[arr[key]] = count;

  }
  for (var key in result) {
    if (result[key] > 4) {
      document.getElementById("status2").innerHTML += "<table style='border:1px #bbb solid;padding:5px;' rules='all' cellpadding='5';><tbody><tr><td width='4%'></td><td width='46%'><h1><a href='https://facebook.com/" + key + "'>" + key + " , " + fanCommentPosts2[key] + " , " + result[key] + "</a></h1></td><td width='46%'></td><td width='4%'></td></tr>" + fanCommentPosts[key] + "</tbody></table><hr>";
    }
  }
  announce = 1;
  if (announce == 1) {
    alert("done");
  }
  document.getElementById("message").innerHTML = " ";



}

function getPhoto() {
  FB.api('/me/picture?type=normal', function(response) {

    var str = "<br/><b>Pic</b> : <img src='" + response.data.url + "'/>";
    document.getElementById("status").innerHTML += str;

  });

}

function Logout() {
  FB.logout(function() {
    document.location.reload();
  });
}

function unique2(array) {
  var n = {},
    r = [],
    len = array.length,
    val, type;
  for (var i = 0; i < array.length; i++) {
    val = array[i];
    type = typeof val;
    if (!n[val]) {
      n[val] = [type];
      r.push(val);
    } else if (n[val].indexOf(type) < 0) {
      n[val].push(type);
      r.push(val);
    }
  }
  return r;
}

// Load the SDK asynchronously
(function(d) {
  var js, id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement('script');
  js.id = id;
  js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));
