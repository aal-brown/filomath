
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

  //Escape function to protect against script injection
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

/* resources.id, resources.user_id, resources.title, resources.resource_url, resources.thumbnail_url, resources.date, likes,global_rating, user_rating
   */
  //Function to create the html for the resource object
  const createResourceElement = function(resObj) {

    let resTemplate = `
      <article class="resource-container">
      <header>
        <span id="title">${escape(resObj.title)}</span>
        <span id="title">Category: ${escape(resObj.category)}</span>
      </header>
      <span id="body">
        <img id="thumbnail-img" src="${escape(resObj.thumbnail_url)}">
        <span id="description">${escape(resObj.description)}</span>
      </span>
      <footer>
          <span id="likes">Likes: ${escape(resObj.likes)}</span>
          <span class="ratings">
            <span id="personal-rating">My Rating: ${escape(resObj.user_rating)}</span>
            <span id="personal-rating">Global Rating: ${escape(Number(resObj.global_rating).toFixed(1))}</span>
          </span>
        </footer>
    </article>
  `;
    return resTemplate;
  };

  //Function that initiates the creation of the html for each resource and then prepends it to the page html.
  let resContainer = $("#resources-container");
  const renderResources = function(resObjArr) {
    resContainer.empty();
    resObjArr.forEach((value) => {
      resContainer.append(createResourceElement(value));
    });
  };


  //This function is used within the create resource function to get the resources and display them on the page.
  const loadResources = function() {
    $.ajax({
      url: "/user/uresources",
      method: "GET"
    }).then(function(resourceData) {
      renderResources(resourceData);
    });
  };

  //This function loads the new tweets as soon as the page loads
  $(window).on("load", loadResources());


  //This function will load the users resources when the "My Resources" item is clicked on in the nav-bar
  $("#myresources").on("click", function(event) {
    event.preventDefault();
    loadResources();
  });

<<<<<<< HEAD

  $("#search-form").on("submit", function(event) {
    event.preventDefault();

    let data = $("[name='searchParam']").val();

    if (!data) {
      window.alert("Searching for nothing? Here you go ___________________.");
    }

    $.ajax({
      url: "/user/search",
      method: "POST",
      data: data
    }).then((res) => {
      console.log(res)
    })

});



=======
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
>>>>>>> 16858175cd04e87437be06bc1dd05e4a01684e45

});

