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
      <article class="resource-container">
      <header name >
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
      <header name >
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
/*   $(window).on("load", loadResources(createResourceElement)); */


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


  const formTemplate = `
      <form class="new-resource" action="/user/resource" method="POST">
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
