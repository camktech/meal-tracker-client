$(document).ready(() => {
  var $email = $('#login-email');
  var $password = $('#login-password');

  $('#sign-in-button').click((e) => {
    e.preventDefault();
    signIn(buildUser($email.val(), $password.val()));
    $email.val(null);
    $password.val(null);
  });
});

function signIn(user){
  $.post({
    url: `${HOST}/login`,
    data: user,
    xhrFields: {
        withCredentials: true
      }
  })
  .done((user) => {
    setLocalStorage('user', JSON.stringify(user));
    transition('meal-history');
    notify(`Welcome ${user.name}`);
  })
  .fail((data) => {
    notify(data.responseJSON.error, true);
  });
}

function buildUser(email, password){
  var user = {
    email: email,
    password: password
  };
  return {user: user};
}