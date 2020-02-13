//Function to compute the elapsed time since resource creation
const timeElapsed = function(dateItem) {
  let timeEl = ((Number(Date.now()) - Number(dateItem)) / 1000);
  let timeElStr = "";

  if (timeEl >= 31536000) {
    timeElStr += `${(Math.floor(timeEl / 31536000))} y `;
    timeEl -= (Math.floor(timeEl / 31536000)) * 31536000;

  } if (timeEl >= 86400) {
    timeElStr += `${(Math.floor(timeEl / 86400))} d `;
    timeEl -= (Math.floor(timeEl / 86400)) * 86400;

  } if (timeEl >= 3600) {
    timeElStr += `${(Math.floor(timeEl / 3600))} h `;
    timeEl -= (Math.floor(timeEl / 3600)) * 3600;

  } if (timeEl >= 60) {
    timeElStr += `${(Math.floor(timeEl / 60))} min `;
    timeEl -= (Math.floor(timeEl / 60)) * 60;
  } else if (timeEl < 60) {
    timeElStr += `0 min `;
  }
  return timeElStr + "ago";
};

const chooseLikeElement = function(resObj) {
  if(resObj.liked) { resObj.liked = "../../public/images/liked.png" }
  else { resObj.liked = "../../public/images/like.png"};

  return resObj
}

