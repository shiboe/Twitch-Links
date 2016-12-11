Mustache = require 'mustache'

savedUrlTemplate = require '../../../templates/url.jade'

class SavedManager
  constructor: ->
    @saved = []
    @storage = null

  init: (storage, linkManager) ->
    @linkManager = linkManager
    @storage = storage

    storage.getSavedUrls (urls) =>
      @saved = urls

  load: (urls) ->
    @saved = urls

  build: ->
    container = document.getElementById 'twitchlinks-saved-list'
    container.innerHTML = if @saved.length then '' else "<div class='no-content'>there are no saved links</div>"

    @saved.forEach (savedUrl) =>
      el = document.createElement 'div'
      el.classList.add 'saved-url'

      text = savedUrl.split('://')[1]
      if text.indexOf('www.') is 0 then text = text.substr(4)

      el.innerHTML = Mustache.render savedUrlTemplate,
        url: savedUrl
        text: text

      el.querySelector('.remove').addEventListener 'click', (e) =>
        @storage.unsaveUrl savedUrl, =>
          @linkManager.links.forEach (link) =>
            if link.url is savedUrl then link.saved = false

      container.appendChild el

  isSaved: (url) ->
    @saved.indexOf(url) isnt -1


module.exports = SavedManager
