Mustache = require 'mustache'

hiddenUrlTemplate = require '../../../templates/url.jade'

class HiddenManager
  constructor: ->
    @hidden = []
    @storage = null

  init: (storage, linkManager) ->
    @linkManager = linkManager
    @storage = storage

    storage.getHiddenUrls (urls) =>
      @hidden = urls

  load: (urls) ->
    @hidden = urls

  build: ->
    container = document.getElementById 'twitchlinks-hidden-list'
    container.innerHTML = if @hidden.length then '' else "<div class='no-content'>there are no hidden links</div>"

    @hidden.forEach (hiddenUrl) =>
      el = document.createElement 'div'
      el.classList.add 'hidden-url'

      text = hiddenUrl.split('://')[1]
      if text.indexOf('www.') is 0 then text = text.substr(4)

      el.innerHTML = Mustache.render hiddenUrlTemplate,
        url: hiddenUrl
        text: text

      el.querySelector('.remove').addEventListener 'click', (e) =>
        @storage.unhideUrl hiddenUrl, =>
          @linkManager.links.forEach (link) =>
            if link.url is hiddenUrl then link.hidden = false

      container.appendChild el

  isHidden: (url) ->
    @hidden.indexOf(url) isnt -1


module.exports = HiddenManager
