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

// Loading animation
function inProcess() {
  document.getElementById('ayn').style.visibility = "hidden";
  document.getElementsByClassName('spinner')[0].style.display = 'block';
}
function finished() {
  document.getElementsByClassName('spinner')[0].style.display = 'none';
  document.getElementById('ayn').style.visibility = "visible";
}

// Data object
var fbApiData = {};
var processNo = 0;


// Get Fan Info
function getFanInfo(page) {

  inProcess();

  var getUrl = '/' + page + '/posts?fields=story,status_type,story_tags,full_picture,created_time,id,message&limit=50&access_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';

  FB.api(getUrl, function(response) {
    processNo = 0;
    var totalPost = response.data.length;

    for (var i = 0; i < totalPost; i++) {
      getComment(totalPost, page, response.data[i].message, response.data[i].id);
    }
  });
}


// Get Comments
function getComment(totalPost, page, message, postid) {

  var getUrl = '/' + postid + '/comments?limit=1000&access_token=252632974766472|umIeZwLxnbq9NLOlWidkkWW8tSM';

  FB.api(getUrl, function(response) {

    for (var j = 0; j < response.data.length; j++) {

      var userId = response.data[j].from.id;

      if (!fbApiData[userId]) {
        fbApiData[userId] = {
          name: response.data[j].from.name,
          data: []
        };
      }

      fbApiData[userId].data.push({
        page: page,
        created_time: response.data[j].created_time,
        post: message,
        comment: response.data[j].message,
        commentId: response.data[j].id
      });

    }

    // 偵測是否完成
    processNo++;
    if (processNo === totalPost) {
      finished();
    }

  });
}


// Count Members
function countMembers() {

  for (var key in fbApiData) {

    if (fbApiData[key].data.length > 4) {

      var commentData = '';

      for (var i = 0; i < fbApiData[key].data.length; i++) {

        commentData += '<tr><td>' + fbApiData[key].data[i].created_time + '</td><td><a href=https://facebook.com/' + fbApiData[key].data[i].commentId + '>' + fbApiData[key].data[i].comment + '</a></td><td>(' + fbApiData[key].data[i].post + ')</td><td>[' + fbApiData[key].data[i].page + ']</td></tr>';
      }

      document.getElementById("status2").innerHTML += "<table class='main-table' style='border:1px #bbb solid;padding:5px;' rules='all' cellpadding='5';><tbody><tr><td width='4%'></td><td width='46%'><h1><a href='https://facebook.com/" + key + "'>" + key + " , " + fbApiData[key].name + " , " + fbApiData[key].data.length + "</a></h1></td><td width='46%'></td><td width='4%'></td></tr>" + commentData + "</tbody></table><hr>";

    }
  }
}
