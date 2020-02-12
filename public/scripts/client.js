$(document).ready(() => {

  /* const { timeElapsed } = require("./helpers"); */

/* $("#logout").on("click", function(event) {
    event.preventDefault();

    $.ajax({
      url:"/user/logout",
      method: "PUT"
    }).then(() => {
      window.location.href = "/main";
    });

  }); */

  //Escape function to protect against script injection
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  /*resources.id, resources.user_id, resources.title, resources.resource_url, resources.thumbnail_url, resources.date, likes,global_rating, user_rating
  */


  //Function to create the html for the "my resources" object
  const createResourceElement = function(resObj) {

    let rDate = new Date(resObj.date);
    let msDate = rDate.getTime();

    let timeStr = timeElapsed(msDate);

    let resTemplate = `
      <article class="resource-container" name="${escape(resObj.id)}">
      <header>
        <span id="title">${escape(resObj.title)}</span>
        <span id="date">${escape(timeStr)}</span>
        <span id="category">Category: ${escape(resObj.category)}</span>
      </header>
      <span id="body">
        <img id="thumbnail-img" src="${escape(resObj.thumbnail_url)}">
        <span id="description">${escape(resObj.description)}</span>
      </span>
      <footer>
          <img id="like-icon" src="">
          <span id="likes">Likes: ${escape(resObj.likes)}</span>
          <a href="${escape(resObj.resource_url)}">Visit Resource</a>
          <span class="ratings">
            <span id="personal-rating">My Rating: ${escape(resObj.user_rating)}</span>
            <span id="global-rating">Global Rating: ${escape(Number(resObj.global_rating).toFixed(1))}</span>
          </span>
        </footer>
    </article>
  `;
    return resTemplate;
  };

  //Function to create the html for the searched resources objects
  const createSearchedElement = function(resObj) {

    let rDate = new Date(resObj.date);
    let msDate = rDate.getTime();

    let timeStr = timeElapsed(msDate);

    let resTemplate = `
      <article class="resource-container">
      <header>
        <span id="title">${escape(resObj.title)}</span>
        <span id="date">${escape(timeStr)}</span>
        <span id="date">${escape(resObj.username)}</span>
        <span id="title">Category: ${escape(resObj.category)}</span>
      </header>
      <span id="body">
        <img id="thumbnail-img" src="${escape(resObj.thumbnail_url)}">
        <span id="description">${escape(resObj.description)}</span>
      </span>
      <footer>
          <span id="likes">Likes: ${escape(resObj.likes)}</span>
          <a href="${escape(resObj.resource_url)}">Visit Resource</a>
          <span class="ratings">
            <span id="personal-rating">My Rating: ${escape(resObj.user_rating)}</span>
            <span id="personal-rating">Global Rating: ${escape(Number(resObj.global_rating).toFixed(1))}</span>
          </span>
        </footer>
    </article>
  `;
    return resTemplate;
  };

  const createFullResourceElement = function(resObj) {
    let rDate = new Date(resObj.date);
    let msDate = rDate.getTime();

    let timeStr = timeElapsed(msDate);

    let fullResTemplate = `
    <article class="resource-page">
      <header>
        <div id="top">
          <input id="return" type="submit" value="Return">
          <span id="title">${escape(resObj.title)}</span>
        </div>
        <div>
          <span id="res-author">Created By: ${escape(resObj.author)}</span>
          <span id="res-category">${escape(resObj.category)}</span>
        </div>
      </header>
      
      <span class="resource-info">
        <img id="res-img" src="${escape(resObj.thumbnail_url)}">
        <span id="desc-box">
          <span id="res-description">${escape(resObj.description)}</span>
          <span id="res-url">${escape(resObj.resource_url)}</span>
        </span>
      </span>
      <span id="foot">
        <span id="res-likes">Likes: ${escape(resObj.likes)}</span>
        <span id="res-likes">Created: ${timeStr}</span>
        <span class="res-ratings">
          <span id="my-rating">My Rating: ${escape(resObj.user_rating)}</span>
          <span id="global-rating">Global Rating: ${escape(Number(resObj.global_rating).toFixed(1))}</span>
        </span>
      </span>
      <span id="comment-section">
        <form class="comment-form">
          <label for="commentSubmission"></label><input type="text" id="commentSubmission" name="commentSubmission" placeholder="Leave a comment">
          <input type="hidden" id="ID" name="ID" value="${escape(resObj.id)}">
          <input type="submit" value="Post">
        </form>
        <div id="comments">
    `;

    for(let comment of resObj.commentData) {
      fullResTemplate += createCommentElement(comment);
    }

    fullResTemplate += `
      </div>
      </span>
    </article>
    `;

    return fullResTemplate;
  };

  const createCommentElement = function(comment) {
    let date = new Date(comment.date)
    let msDate = date.getTime();
    comment.date = timeElapsed(msDate);

    const commentTemplate = `
    <article class="comment-container">
    <header>
      <span id="comment-user">${escape(comment.comment_author)}</span>
      <span id="comment-date">${escape(comment.date)}</span>
    </header>
    <span id="body">
      <span id="message">${escape(comment.message)}</span>
    </span>
    </article>
    `;

    return commentTemplate;
  }

  const loadFullResource = function(resObj) {
    let container = $("#single-resource");
    container.append(createFullResourceElement(resObj));

    $(".comment-form").on("submit", function(event) {
      event.preventDefault();
      let message = $("[name='commentSubmission']").val();
      let resID = $("[name='ID']").val();

      $.ajax({
        url: "/user/comment",
        method: "POST",
        data: { ID: resID, commentSubmission: message }
      }).then( function(commentData) {
        appendNewComment(commentData);
     });
    });

    $("#return").on("click", function(event) {
      $("#resources-container").slideDown(() => {}); //shows resources
      $("#single-resource").slideUp(() => {});
      container.empty();
    }).children().click(function(event) {
      event.stopPropagation();
    });
  }

  const appendNewComment = function(comment) {
    console.log(comment);
    let container = $("#comments");
    container.prepend(createCommentElement(comment));
  }
  
   //Function to create the html for the my profile object
  const makeProfile = function(userData) {

    let profileTemplate = `

    <section id="profile-container">
        <!---------------------------NAME-------------------------->
        <div class="profile-content">
          <span id=user-name">Name: ${escape(userData.name)}</span>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
            Edit
          </button>
          <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Enter New Name</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form id="edit-name" class="md-form mb-4">
                    <i class="fas fa-lock prefix grey-text"></i>
                    <input name="name" id="orangeForm-pass" class="form-control">
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
        </div>
      </div>
        <!---------------------------EMAIL-------------------------->
        <div class="profile-content">
          <span id="user-email">EMAIL: ${escape(userData.email)}</span>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
            Edit
          </button>
          <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Enter New Email Address</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form id="edit-name" class="md-form mb-4">
                    <i class="fas fa-lock prefix grey-text"></i>
                    <input name="name" id="orangeForm-pass" class="form-control">
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      <footer id="user-stats">
        <span id="resources">
          Resources Created: ${escape(userData.created_resources)}
        </span>
        <span id="resources">
          Likes: ${escape(userData.my_likes)}
        </span>
        <span id="resources">
          Ratings: ${escape(userData.my_ratings)}
        </span>
        <span id="resources">
          Comments: ${escape(userData.my_comments)}
        </span>
      </footer>
    </section>
  `;
    return profileTemplate;
  };


  //Function that initiates the creation of the html for each user resource and then adds it to the page html.
  let resContainer = $("#resources-container");

  const renderResources = function(resObjArr, callback) {
    resContainer.empty();
    resObjArr.forEach((value) => {
      resContainer.append(callback(value));
    });

    $(".resource-container").click(function(event) {
      
      $.ajax({
        url: "/user/resource",
        method: "POST",
        data: {ID: $(this).attr('name')}
      }).then( function(resourceData) {
        loadFullResource(resourceData);
        $("#single-resource").slideDown("slow",() => {});
        $("#resources-container").slideUp("slow", () => {}); //hides all resource containers
      });
    });
  };




  //This function is used within the create resource function to get the resources and display them on the page.
  const loadResources = function(callback) {
    $.ajax({
      url: "/user/uresources",
      method: "GET"
    }).then(function(resourceData) {
      renderResources(resourceData, callback);
    });
  };

  //This function loads the user resources as soon as the page loads from a get request to the main page
  $(window).on("load", loadResources(createResourceElement));


  //Render the profile template
  const renderProfile = function(userData, callback) {
    resContainer.empty();
    resContainer.append(callback(userData));
  };


  //This function will load the users resources when the "My Resources" item is clicked on in the nav-bar
  $("#myresources").on("click", function(event) {
    event.preventDefault();
    loadResources(createResourceElement);
  });

  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    let data = $("[name='searchParam']").val();

    data = data.toLowerCase();

    if (!data) {
      return window.alert("Searching for nothing? Here you go ___________________.");
    }
    const searchParam = {searchParam: data};

    $.ajax({
      url: "/user/search",
      method: "POST",
      data: searchParam
    }).then((res) => {
      renderResources(res,createSearchedElement);
    });

  });

  //this toggles the new resource form to show or hide it
  $("#newresource").on("click", function(event) {
    event.preventDefault();
    $("#resource-form").slideToggle("fast", () => {});
    $("#title").focus();
  });

  //Handler for when "My Profile" button is clicked.
  $("#myprofile").on("click", function(event) {
    event.preventDefault();

    $.ajax({
      url: "/user/profile",
      method: "GET"
    }).then((userData) => {
      renderProfile(userData, makeProfile);
    });

  });

});
