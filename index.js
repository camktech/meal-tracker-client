const HOST = 'http://localhost:3000';

function getLocalStorage(key){
  console.log(key)
  console.log(`meal-tracker-data-${key}`)
  localStorage.getItem(`meal-tracker-data-${key}`);
}

function setLocalStorage(key, value){
  localStorage.setItem(`meal-tracker-data-${key}`, value);
}

function notify(message, error = false){
  let $alert = $('#alert');

  // prevent animation stacking
  $alert.stop();
  $alert.text("");
  $alert.css({opacity: 1.0});
  if($alert.hasClass('error')){
    $alert.removeClass('error');
  }
  // ==================

  $alert.text(message);
  if(error){
    $alert.addClass('error');
  }

  $alert.animate(
    {
      opacity: 0.0
    }, 

    3000,

    () => {
      $alert.text("");
      $alert.css({opacity: 1.0});
      if(error){
        $alert.removeClass('error');
      }
    }
  );

}



function transition(page){
  location.hash = `#${page}`;
}

$(document).ready(() => {
  $('.logout').click(() => {
    notify("heelllooooooo", false);
  })
});
