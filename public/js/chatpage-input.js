// Input

const inputField = $("#text-input");
const chatBox = $(".chat-box");
const messageContainer = $(".container");

let username = ""

$.ajax({
  url: '/get-username',
  type: 'GET',
  headers: {
    'user-agent': navigator.userAgent
  },
  success: function(data) {
    console.log('Data received:', data);
    username = data;
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.error('Error:', textStatus, errorThrown);
  }
});

// Send
var socket = io();

inputField.on("keydown", function(event) {
  if (event.which === 13 && !event.shiftKey) {
    event.preventDefault();
    socket.emit('chat message', {name: username, msg: inputField.val().trim(), time: getTime()});
    sendMessage()
    console.log(inputField.val())
    
  } else if (event.which === 13 && event.shiftKey) {
    ;
  }
})


// RECIEVE
socket.on('chat message', function(message){
  const { name, msg, time } = message
  recieveMessage(name, msg, time)
});

// Send message function
function sendMessage(messageText=inputField.val().trim()) {
  const messageLength = messageText.length;

  chatBox.append(`
      <div class="container darker sent">
        <span class="username">${username} (You)</span>
        <p>${messageText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>').replace(/\s+/g, ' ')}</p>
        <span class="time-left">${getTime()}</span>
      </div> 
        `)
  inputField.val("")
  applyFont()

  chatBox.animate({
    scrollTop: chatBox[0].scrollHeight
  }, {
    duration: 500,
    easing: 'easeInOutCubic'
  });

}

// Recieve function
function recieveMessage(username_, msg, time) {
  chatBox.append(`
  <div class="container lighter recieved">
    <span class="username">${username_}</span>
    <p>${msg}</p>
    <span class="time-right">${time}</span>
  </div>
    `)  

  applyFont()

  chatBox.animate({
    scrollTop: chatBox[0].scrollHeight
  }, {
    duration: 500,
    easing: 'easeInOutCubic'
  });
}

// Ge the curret time
function getTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function applyCustomSyntax(text) {
  // replace bold syntax: *text* -> <strong>text</strong>
  text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  
  // replace italic syntax: _text_ -> <em>text</em>
  text = text.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // replace image syntax: (image_url) -> <img src="image_url" />
  text = text.replace(/\((.*?)\)/g, '<img src="$1" />');
  
  return text;
}

function applyFont () {
  $("p").each(function() {
    var length = $(this).text().length;
    if (length > 50) {
      $(this).css("font-size", "20px");
    } else if (length > 20) {
      $(this).css("font-size", "30px");
    } else {
      $(this).css("font-size", "40px");
    }
  });
}
