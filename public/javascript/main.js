$("#homePagePostForm").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var sendData = {
        post: {text: $("#homePagePostInput").val()}
      };
  $.ajax({
      url: "/main/home",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(sendData)
  }).done(function(result){
      updateHomePage("homePagePosts", result);
      removeTextFromInput("homePagePostInput");
  }).fail(function(err){
      console.log(err);
  });
});

$(".homePageCommentForm").submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  var id = this.id;
  var sendData = {
        comment: {text: $("#" + this.id + "-homePageCommentInput").val()}
      };
  var url = "/main/home/comment/" + id;
  $.ajax({
      url: url,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(sendData)
  }).done(function(result){
      updateHomePage(id + "-homePageComments", result);
      removeTextFromInput(id + "-homePageCommentInput");
  }).fail(function(err){
      console.log(err);
  });
});

var updateHomePage = function(id, posts){
  document.getElementById(id).innerHTML = posts;
};

var removeTextFromInput = function(input){
  var removeThis = document.getElementById(input);
  removeThis.value = ""; 
};