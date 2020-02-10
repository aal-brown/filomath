
$(document).ready(() => {

$("#logout").on("click", function(event) {
    event.preventDefault();

    $.ajax({
      url:"/user/",
      method: "PUT"
    }).then();

  });

});
