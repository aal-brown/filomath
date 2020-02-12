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
      $("#resources-container").show(() => {}); //shows resources
      $("#single-resource").hide(() => {});
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

  //Function that initiates the creation of the html for each user resourceresource and then prepends it to the page html.
  let resContainer = $("#resources-container");

  const renderResources = function(resObjArr, createFunctionCallback) {
    resContainer.empty();
    resObjArr.forEach((value) => {
      resContainer.append(createFunctionCallback(value));
    });

    $(".resource-container").click(function(event) {
      $.ajax({
        url: "/user/resource",
        method: "POST",
        data: {ID: $(this).attr('name')}
      }).then( function(resourceData) {
        $("#single-resource").show("fast", () => {});
        $("#resources-container").hide(() => {}); //hides all resource containers
        loadFullResource(resourceData);
      });
    });
  };




  //This function is used within the create resource function to get the resources and display them on the page.
  const loadResources = function(createFunctionCallback) {
    $.ajax({
      url: "/user/uresources",
      method: "GET"
    }).then(function(resourceData) {
      renderResources(resourceData, createFunctionCallback);
    });
  };

  //This function loads the user resources as soon as the page loads from a get request to the main page
  $(window).on("load", loadResources(createResourceElement));


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

  const formTemplate = `
      <form class="new-resource" action="/user/newres" method="POST">
        <h3>Create New Resource</h3>
        <div class="fields">
        <label for="title">Title: </label><input type="text" id="title" name="title">
        </div>
        <div class="fields">
        <label for="url">URL: </label><input type="url" id="url" name="url">
        </div>
        <div class="fields">
        <label for="category">Category: </label><input type="text" id="category" name="category">
        </div>
        <div class="fields">
        <label for="description">Description: </label><input type="text" id="description" name="description">
        </div>
        <div class="fields">
        <label for="thumbnail_url">Thumbnail URL: </label><input type="url" id="thumbnail_url" name="thumbnail_url">
        </div>
        <div class="fields">
        <label for="rating">My Rating: </label><input type="number" id="rating" name="rating">
        </div>
        <div id="submit-cancel-buttons">
          <input type="submit" value="Cancel">
          <input type="submit" value="Submit">
        </div>
      </form>
    `;

  $("#newresource").on("click", function(event) {
    event.preventDefault();
    resContainer.prepend(formTemplate);
  });

});
