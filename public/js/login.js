$("input").keypress(function(event) {
  if (event.which == 13) {
    const text = $(this).val();
    const regex = /^[0-9a-zA-Z_]{1,8}$/;
    if (regex.test(text)) {
      $.ajax({
        type: "POST",
        url: "/login",
        data: { username: $("input").val() },
        success: function(response) {
          console.log("SUCCESS");
          window.location.href = "/"
        }
      });

      $(".error-message").text("")

      $("*").css({transition: "0.5s opacity ease-in-out", opacity: "0"})
    } else {
      //          alert("Invalid input. Please enter 1-8 characters including numbers and underscores, but excluding spaces, symbols, and emoji.");
      $(".error-message").text("Invalid input")
    }
  }
})
