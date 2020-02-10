
$(document).ready(() => {







/* $("#logout").on("click", function(event) {
    event.preventDefault();

    $.ajax({
      url:"/user/logout",
      method: "PUT"
    }).then(() => {
      window.location.href = "/main";
    });

  }); */



  //Function that initiates the creation of the html for each resource and then prepends it to the page html.
  let tweetsContainer = $("#tweets-container");
  const renderTweets = function(tweetsObjArr) {
    tweetsContainer.empty();
    tweetsObjArr.forEach((value) => {
      $("#tweets-container").append(createTweetElement(value));
    });
  };


  //This function is used within the create resource function to get the resources and display them on the page.
  const loadResources = function() {
    $.ajax({
      url: "/uresources",
      method: "GET",
    }).then(function(resourceData) {
      renderTweets(resourceData);
    });
  };







});

