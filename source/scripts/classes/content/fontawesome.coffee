class Fontawesome
  constructor: ->

  loadFont: ->
    fa = document.createElement 'style'
    fa.type = 'text/css'
    fa.textContent = '@font-face { font-family: FontAwesome; src: url("'+ chrome.extension.getURL('fonts/fontawesome-webfont.woff?v=4.0.3')+ '"); }'
    document.head.appendChild fa



module.exports = Fontawesome
