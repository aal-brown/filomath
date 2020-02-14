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

    if (resObj.user_rating === null) {
      resObj.user_rating = "";
    }

    let rDate = new Date(resObj.date);
    let msDate = rDate.getTime();
    let timeStr = timeElapsed(msDate);

    let likedBool = resObj.liked;
    resObj = chooseLikeElement(resObj);

    let resTemplate = `
      <article class="resource-container" name="${escape(resObj.id)}">
      <header>
        <div id="time-category">
          <div id="date-username">
          <span id="date">Created ${escape(timeStr)}</span>
          <span id="username">by <b><i>${escape(resObj.username)}</i></b></span>
          </div>
          <span id="category"><b>Category:</b> ${escape(resObj.category)}</span>
        </div>
        <div id="title-block">
          <span id="title"><b>${escape(resObj.title)}</b></span>
        </div>
      </header>
      <span id="body">
        <img id="thumbnail-img" src="${escape(resObj.thumbnail_url)}">
        <span id="description">${escape(resObj.description)}</span>
      </span>
      <footer>
        <div id="likes-ratings">
          <div id="like-div">
            <img id="like-icon" data-liked="${likedBool}" data-id="${escape(resObj.id)}" src="${escape(resObj.liked)}">
            <span id="likes"> ${escape(resObj.likes)}</span>
          </div>
          <span class="ratings">
            <span id="personal-rating"><b>My Rating:</b> ${escape(resObj.user_rating)}</span>
            <span id="global-rating"><b>Global Rating:</b> ${escape(Number(resObj.global_rating).toFixed(1))}</span>
          </span>
        </div>
        <div id="url-link">
          <a href="${escape(resObj.resource_url)}">Visit Resource</a>
        </div>
      </footer>
    </article>
  `;
    return resTemplate;
  };

  //Function to create the html for the searched resources objects
/*   const createSearchElement = function(resObj) {

    let rDate = new Date(resObj.date);
    let msDate = rDate.getTime();
    let timeStr = timeElapsed(msDate);

    resObj = chooseLikeElement(resObj);

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
      <span id="likes">${escape(resObj.liked)} : ${escape(resObj.likes)}</span>          <a href="${escape(resObj.resource_url)}">Visit Resource</a>
          <span class="ratings">
            <span id="personal-rating">My Rating: ${escape(resObj.user_rating)}</span>
            <span id="personal-rating">Global Rating: ${escape(Number(resObj.global_rating).toFixed(1))}</span>
          </span>
        </footer>
    </article>
  `;
    return resTemplate;
  }; */


  const createFullResourceElement = function(resObj) {
    let rDate = new Date(resObj.date);
    let msDate = rDate.getTime();
    let timeStr = timeElapsed(msDate);

    let likedBool = resObj.liked;

    resObj = chooseLikeElement(resObj);

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
        <div id="like-div">
          <img id="like-icon" data-liked="${likedBool}" data-id="${escape(resObj.id)}" src="${escape(resObj.liked)}">
          <span id="likes"> ${escape(resObj.likes)}</span>
        </div>
        <span id="res-likes">Created: ${timeStr}</span>
        <span class="res-ratings">
          <form id="rate-form" data-rating="${escape(resObj.user_rating)}">
            <label for="rate">Rate: </label><input type="number" min="0" max="5" id="rate" name="rate">
            <input type="hidden" id="resID" name="resID" value="${escape(resObj.id)}">
          </form>
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

    for (let comment of resObj.commentData) {
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
    let date = new Date(comment.date);
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
  };

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
      }).then(function(commentData) {
        appendNewComment(commentData);
      }).catch(err => console.log(err.message));
    });

    $("#return").on("click", function(event) {
      $("#resources-container").slideDown(() => {}); //shows resources
      $("#single-resource").slideUp(() => {});
      container.empty();
    }).children().click(function(event) {
      event.stopPropagation();
    });

    $("#rate-form").on("submit", function(event) {
      event.preventDefault();
      let data = {
        ID: $('#resID').val(),
        rating: $(this).attr("data-rating"),
        rate: $("[name='rate']").val()
      }

      $.ajax({
        url: "/user/rate",
        method: "POST",
        data: data
      }).then((newRating) => {
        $('#my-rating').text('My Rating: ' + newRating.rating.toString());
      }).catch(err => console.log("RATE FORM AJAX ERR:", err.message));

    })
  };

  const appendNewComment = function(comment) {
    console.log(comment);
    let container = $("#comments");
    container.prepend(createCommentElement(comment));
  };

  //Function to create the html for the my profile object
  const makeProfile = function(userData) {

    let profileTemplate = `

    <section id="profile-container">
    <!---------------------------NAME-------------------------->
    <div class="profile-content">
      <span id=user-name"><b>Name:</b> ${escape(userData.name)}</span>
      <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#exampleModalCenter">
        Edit
      </button>
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle"><b>Enter New Name</b></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form id="edit-name" class="md-form mb-4">
              <div class="modal-body">
                <i class="fas fa-lock prefix grey-text"></i>
                <input name="newName" id="orangeForm-name" class="form-control">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" form="edit-name" class="btn btn-primary">Save changes</button>
              </div>
            </form>
          </div>
        </div>
    </div>
  </div>
    <!---------------------------EMAIL-------------------------->
    <div class="profile-content">
      <span id="user-email"><b>Email:</b> ${escape(userData.email)}</span>
      <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#exampleModalCenter2">
        Edit
      </button>
      <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle2"><b>Enter New Email Address</b></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form id="edit-email" class="md-form mb-4"></form>
              <div class="modal-body">
                <i class="fas fa-lock prefix grey-text"></i>
                <input name="newEmail" id="orangeForm-email" class="form-control">
              </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="submit" form="edit-email" class="btn btn-primary">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  <footer id="user-stats">
    <span id="resources">
    <b>Resources Created:</b> ${escape(userData.created_resources)}
    </span>
    <span id="resources">
    <b>Likes:</b> ${escape(userData.my_likes)}
    </span>
    <span id="resources">
    <b>Ratings:</b> ${escape(userData.my_ratings)}
    </span>
    <span id="resources">
    <b>Comments:</b> ${escape(userData.my_comments)}
    </span>
  </footer>
  </section>
  `;
    return profileTemplate;
  };

  //For the nav bar drop down, this is the template for each nav item.
  const dropDwnCats = function(catData) {

    let dropDownTemplate = `
    <a class="dropdown-item" name="${escape(catData.id)}" href="#">${escape(catData.category)}</a>
    `;
    return dropDownTemplate;
  };

  //A separate format is needed for the non-bootstrap drop down in the create new element.
  const dropDwnCatsFormat2 = function(catData) {

    let dropDownTemplate = `
    <option class="dropdown-item-2" value="${escape(catData.id)}">${escape(catData.category)}</option>
    `;
    return dropDownTemplate;
  };



  const renderDropDown = function(resObjArr, callback, target) {
    target.empty();
    resObjArr.forEach((value) => {
      target.append(callback(value));
    });
  };

  let dropDownContainer = $("#drop-down-1");
  let dropDownContainer2 = $("#drop-down-2");

  //This renders the drop down menu for the navbar and allows clicks to be registered and the search to be triggered
  $("#navbarDropdownMenuLink").on("click", function(event) {
    event.preventDefault();
    $.ajax({
      url: "/user/categories",
      method: "GET"
    }).then((catData) => {
      renderDropDown(catData,dropDwnCats,dropDownContainer);

      $(".dropdown-item").on("click", function(event) {
        event.preventDefault();

        let catData = {catData:$(this).attr("name")};

        $.ajax({
          url: "/user/search/categs",
          method: "POST",
          data: catData
        })
          .then((res) => {

            renderResources(res,createResourceElement);
          }).catch(err => console.log(err.message));
      });

    });
  });


//This renders the drop down menu for the new resources item
/* $("#fetch-cats").on("click", function(event) {
    event.preventDefault();
    $.ajax({
      url: "/user/categories",
      method: "GET"
    }).then((catData) => {
      renderDropDown(catData,dropDwnCatsFormat2,dropDownContainer2);
    });
  }); */ //This was moved into the new resources event listener.



  //Function that initiates the creation of the html for each user resource and then adds it to the page html.
  let resContainer = $("#resources-container");

  const renderResources = function(resObjArr, callback) {
    resContainer.empty();
    resObjArr.forEach((value) => {
      resContainer.append(callback(value));
    });
  };




  //This function is used within the create resource function to get the resources and display them on the page.
  const loadResources = function(callback) {
    $.ajax({
      url: "/user/uresources",
      method: "GET"
    }).then(function(resourceData) {
      renderResources(resourceData, callback);
    })
    .catch(err => console.log(err.message));
  };

  //This function loads the user resources as soon as the page loads from a get request to the main page
  $(window).on("load", loadResources(createResourceElement));


  //Render the profile template
  const renderProfile = function(userData, callback) {
    resContainer.empty();
    resContainer.append(callback(userData));
  };

  //Request name change.
  //This code puts an event listener on the BODY that triggers when the "edit-name" form is submitted, throigh bubbling it can catch it. This allows us to deal with the issues that were happening before with
  $("body").on("submit","#edit-name", function(event) {

    /* event.preventDefault(); */

    let newName = {name: $("[name='newName']").val()};

    if (!newName.name) {
      return window.alert("ERROR: Input Field Is Empty");
    }

    $.ajax({
      url: "/user/profile/editname",
      method: "POST",
      data: newName
    }).then().catch(err => console.log(err.message));

  });

  //TODO: if a user was to mash like-icon over and over it lags
  $("body").on("click","#like-icon", function(event) {
    event.stopPropagation();

    let liked = $(this).attr('data-liked');
    let resID = $(this).attr('data-id');
    let likesNum = Number($(this).next().text());
    console.log("NUM OF LIKES:", likesNum);

    if (liked === 'true') { liked = true }
    else { liked = false };

    if(liked) {
      $(this).attr("src","../../public/images/like.png");
      $(this).next().text((likesNum - 1).toString());
      $(this).attr("data-liked", "false");
    } else {
      $(this).attr("src","../../public/images/liked.png");
      $(this).next().text((likesNum + 1).toString());
      $(this).attr("data-liked", "true");
    };

    $.ajax({
      url: "/user/like",
      method: "POST",
      data: {liked: liked, ID: resID}
    }).then().catch(err => console.log("AJAX CALL ERR: ", err.message));
  });

  $("body").on("click", ".resource-container", function(event) {
    if(event.target.id === "like-icon") { return };

    $.ajax({
      url: "/user/resource",
      method: "POST",
      data: {ID: $(this).attr('name')}
    }).then( function(resourceData) {
      loadFullResource(resourceData);
      $("#single-resource").slideDown("slow",() => {});
      $("#resources-container").slideUp("slow", () => {}); //hides all resource containers
    }).catch(err => console.log("RENDER FULL RESOURCE ERR", err.message));
  });

  //Request email change.
  //This code puts an event listener on the BODY that triggers when the "edit-name" form is submitted, throigh bubbling it can catch it. This allows us to deal with the issues that were happening before with
  $("body").on("submit","#edit-email", function(event) {

    /* event.preventDefault(); */
    let newEmail = {email: $("[name='newEmail']").val()};

    if (!newEmail.email) {
      return window.alert("ERROR: Input Field Is Empty");
    }

    $.ajax({
      url: "/user/profile/editemail",
      method: "POST",
      data: newEmail
    }).then().catch(err => console.log(err.message));

  });


  //This function will load the users resources when the "My Resources" item is clicked on in the nav-bar
  $("#myresources").on("click", function(event) {
    event.preventDefault();
    loadResources(createResourceElement);
  });

  //Search form submission handler
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
      renderResources(res,createResourceElement);
    }).catch(err => console.log(err.message));
  });

//This is a specific get request for liked resources
  const loadLikedResources = function(callback) {
    $.ajax({
      url: "/user/lresources",
      method: "GET"
    }).then(function(resourceData) {
      renderResources(resourceData, callback);
    })
      .catch(err => console.log(err.message));
  };


  //This function will load the users liked resources when the "My Resources" item is clicked on in the nav-bar
  $("#likedresources").on("click", function(event) {
    event.preventDefault();
    loadLikedResources(createResourceElement);
  });


  //this toggles the new resource form to show or hide it
  $("#newresource").on("click", function(event) {
    event.preventDefault();
    $("#resource-form").slideToggle("fast", () => {});
    $("#restitle").focus();
    //This renders the drop down menu for the create new resources "category" item
    $.ajax({
      url: "/user/categories",
      method: "GET"
    }).then((catData) => {
      renderDropDown(catData,dropDwnCatsFormat2,dropDownContainer2);
    });

  });

  $("body").on("click", "#cancel-form", function(event) {
    $("#resource-form").slideToggle("fast", () => {});
  });


  //Handler for when "My Profile" button is clicked.
  $("#myprofile").on("click", function(event) {
    event.preventDefault();

    $.ajax({
      url: "/user/profile",
      method: "GET"
    }).then((userData) => {
      renderProfile(userData, makeProfile);
    }).catch(err => console.log(err.message));

  });

});
