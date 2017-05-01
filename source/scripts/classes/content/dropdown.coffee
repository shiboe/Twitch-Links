Mustache = require 'mustache'

dropdownTemplate = require '../../../templates/dropdown.jade'

class Dropdown
  constructor: ->
    @expanded = false

  toggle: ->
    @expanded = !@expanded

  exists: ->
    document.getElementById 'twitchlinks-dropdown'

  build: (linkManager, savedManager, hiddenManager) ->
    liveChat = document.getElementsByClassName('chat-header').length isnt 0
    replayChat = document.getElementsByClassName('cn-chat-replay-header').length isnt 0

    if document.readyState isnt 'complete' or !(liveChat or replayChat)
      return false

    twitchChatContainer = document.getElementById('right_col')
    if !twitchChatContainer then return false

    container = document.createElement 'div'
    container.id = 'twitchlinks-dropdown'
    container.innerHTML = Mustache.render dropdownTemplate

    twitchChatContainer.appendChild container

    document.getElementById('twitchlinks-expand-button').addEventListener 'click', (e) =>
      document.getElementById('twitchlinks-expand-container').classList.toggle 'expand'

    document.getElementById('twitchlinks-top-bar').querySelector('.views').addEventListener 'click', (e) =>
      src = e.srcElement
      actives = [].slice.call(document.querySelectorAll('#twitchlinks-expand-container .active'))

      newActive = (container) ->
        actives.forEach (active) ->
          active.classList.remove 'active'

        src.classList.add 'active'
        document.getElementById(container).classList.add 'active'

      if src.classList.contains 'view-all'
        newActive 'twitchlinks-link-list'
      else if src.classList.contains 'view-saved'
        newActive 'twitchlinks-saved-list'
      else if src.classList.contains 'view-hidden'
        newActive 'twitchlinks-hidden-list'

    savedManager.build()
    hiddenManager.build()

    return true

  load: (content) ->
    document.getElementById('twitchlinks-expand-container').innerHTML = content

  updateNotifsInDOM: ->
    notifCount = document.getElementById 'twitchlinks-notif-count'
    container = document.getElementById 'twitchlinks-link-list'

    linkCount = container
      .querySelectorAll '.link'
      .length

    notifCount.innerHTML = linkCount

    if linkCount then notifCount.classList.remove 'empty' else notifCount.classList.add 'empty'


module.exports = Dropdown
