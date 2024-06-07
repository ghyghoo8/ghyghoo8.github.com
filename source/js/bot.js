(function () {
  window.embeddedChatbotConfig = {
    chatbotId: "z322nJiXx5sA8wPuwGyAM",
    domain: "www.chatbase.co"
  }
    
  window.onload = function () {
    let script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.setAttribute('chatbotId', 'z322nJiXx5sA8wPuwGyAM')
    script.setAttribute('domain', 'www.chatbase.co')
    document.body.append(script);
  }
})()