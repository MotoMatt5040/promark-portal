// This is considered not used
$(function() {
    $('a#test').on('click', function(e) {
      e.preventDefault()
      $.getJSON('/send-message',
        function(data) {
          //nothing goes here
        });
      document.getElementById("phone_number").innerHTML = "Test Text"
      return false;
    });
});