//Ajax when adding post in home page 
$("#homePagePostForm").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var sendData = {
        post: {text: $("#homePagePostInput").val()}
      };
  $.ajax({
      url: "/home",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(sendData)
  }).done(function(result){
      updateHomePage("homePagePosts", result.html);
      updateHomePage("userPostsLength", result.userPostsLength);
      removeTextFromInput("homePagePostInput");
  }).fail(function(err){
      console.log(err);
  });
});

//Ajax when adding comment in each post in home page 
$(document).on('submit','.homePageCommentForm', function(e) {
  e.preventDefault();
  e.stopPropagation();
  var id = $(this).attr('id');
  var sendData = {
        comment: {text: $("#" + id + "-homePageCommentInput").val()}
      };
  var url = "/home/comment/" + id;
  $.ajax({
      url: url,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(sendData)
  }).done(function(result){
      updateHomePage(id + "-homePageComments", result.html);
      updateHomePage(id + "-homePageCommentsNumber", result.postCommentsLength);
      removeTextFromInput(id + "-homePageCommentInput");
  }).fail(function(err){
      console.log(err);
  });
});

//Ajax when clicking like in each post in home page 
$(document).on('click','.homePagePostLike', function(e) {
  e.preventDefault();
  e.stopPropagation();
  var id = $(this).attr('id');
  var url = "/home/like/" + id;
  $.ajax({
      url: url,
      type: "POST",
  }).done(function(result){
      updateHomePage(`${id}-homePageLikesNumber`, result);
      //Check if farThumbsUp exists
      if ($(`#${id}-farThumbsUp`).length){
        updateHomePageOuter(`${id}-farThumbsUp`, 
          `<i id="${id}-fasThumbsUp" class="fas fa-thumbs-up"></i>`
        );
      } else {
        updateHomePageOuter(`${id}-fasThumbsUp`, 
          `<i id="${id}-farThumbsUp" class="far fa-thumbs-up"></i>`
        );
      }
  }).fail(function(err){
      console.log(err);
  });
});

//Ajax when clicking Add Friend Button
$(document).on('click','.addFriendButton', function(e) {
  e.preventDefault();
  e.stopPropagation();
  var id = $(this).attr('id');
  var url = "/profile/" + id;
  $.ajax({
      url: url,
      type: "POST",
  }).done(function(result){
    updateHomePageOuter(id, result.html);
  }).fail(function(err){
      console.log(err);
  });
});

//Ajax for search bar
$("#search").keyup(function(){
  $("#searchResult").html('');
  var sendData = {
        query: $("#search").val()
      };
  var url = "/main/search";
  $.ajax({
      url: url,
      type: "GET",
      data: JSON.stringify(sendData)
  }).done(function(result){
      if(result.length === 0){
        $("#searchResult").append('<p>No Results</p>')
      } else {
        result.forEach(function(user){
          $("#searchResult").append('<a href="/profile/' + user.id + '">' + user.firstName + ' ' + user.lastName + '</a>')
        });
      }
  }).fail(function(err){
      console.log(err);
  });
});

//Change the inner HTML
var updateHomePage = function(id, posts){
  document.getElementById(id).innerHTML = posts;
};

//Change the Outer HTML
var updateHomePageOuter = function(id, posts){
  document.getElementById(id).outerHTML = posts;
};

//Remove the "value" from the post/comment input box
var removeTextFromInput = function(input){
  var removeThis = document.getElementById(input);
  removeThis.value = ""; 
};
