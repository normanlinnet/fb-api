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


var fbApiData = {};

function getFanInfo(page) {

  var getUrl = '/' + page + '/posts?fields=story,status_type,story_tags,full_picture,created_time,id,message&limit=50&access_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';

  FB.api(getUrl, function(response) {
    for (var i = 0; i < response.data.length; i++) {
      getComment(page, response.data[i].message, response.data[i].id);
    }
  });
}

function getComment(page, message, postid) {

  var getUrl = '/' + postid + '/comments?limit=1000&access_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';

  FB.api(getUrl, function(response) {

    for (var key in response.data) {

      var userId = response.data[key].from.id;

      if (!fbApiData[userId]) {
        fbApiData[userId] = {
          name: response.data[key].from.name,
          data: []
        };
      }

      fbApiData[userId].data.push({
        page: page,
        created_time: response.data[key].created_time,
        post: message,
        comment: response.data[key].message,
        commentId: response.data[key].id
      });

    }
  });
}

function countMembers() {
  console.log(fbApiData);

  for (var key in fbApiData) {
    // var fbApiData[key].data = fbApiData[key].data;


    if (fbApiData[key].data.length > 4) {

      var commentData = '';
      console.log('--');
      console.log(fbApiData[key].data);

      for (var i = 0; i < fbApiData[key].data.length; i++) {

        commentData += '<tr><td>' + fbApiData[key].data[i].created_time + '</td><td><a href=https://facebook.com/' + fbApiData[key].data[i].commentId + '>' + fbApiData[key].data[i].comment + '</a></td><td>(' + fbApiData[key].data[i].post + ')</td><td>[' + fbApiData[key].data[i].page + ']</td></tr>';
      }

      document.getElementById("status2").innerHTML += "<table class='main-table' style='border:1px #bbb solid;padding:5px;' rules='all' cellpadding='5';><tbody><tr><td width='4%'></td><td width='46%'><h1><a href='https://facebook.com/" + key + "'>" + key + " , " + fbApiData[key].name + " , " + fbApiData[key].data.length + "</a></h1></td><td width='46%'></td><td width='4%'></td></tr>" + commentData + "</tbody></table><hr>";

    }
  }
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



setTimeout(function () {
  getFanInfo('myudn');
}, 4000);
