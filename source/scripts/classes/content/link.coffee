Mustache = require 'mustache'

linkTemplate = require '../../../templates/link.jade'

class Link
  constructor: (@url, @author, @saved, @hidden) ->
    @lastPost = new Date().getTime()

    @text = @url.split('://')[1]
    if @text.indexOf('www.') is 0 then @text = @text.substr(4)

    @dead = false

    @content = null


  absorbDuplicates: (links) ->
    # for each of our check links
    links.filter (link) =>
      # if it's a duplicate and not dead
      if link.url is @url and !link.dead
        # copy relevant properties
        @author = link.author
        @lastPost = new Date().getTime()
        # remove from list
        return false
      return true

  purgeCheck: (now, ageLimit) ->
    stale = now - @lastPost > ageLimit

    if stale
      @removeFromDOM()
      @dead = true

  removeFromDOM: ->
    @content.parentElement.removeChild @content

  updateDOM: (now, config) ->
    if !@dead
      @content.querySelector('.author').innerHTML = @author

      ageBar = @content.querySelector('.age-bar .color')

      age = now - @lastPost
      lifeSpan = 1 - (age / config.ageLimit)

      if lifeSpan > .5 then color = '#65d68a'
      else if lifeSpan > .1 then color = 'orange'
      else color = 'red'

      ageBar.style.transform = "scale(#{lifeSpan},1)"
      ageBar.style.backgroundColor = color

      if @saved and !@content.classList.contains 'saved' then @content.classList.add 'saved'
      if !@saved and @content.classList.contains 'saved' then @content.classList.remove 'saved'

      if @hidden and !@content.classList.contains 'hidden' then @content.classList.add 'hidden'
      if !@hidden and @content.classList.contains 'hidden' then @content.classList.remove 'hidden'


  createElement: (storage) ->
    @content = document.createElement 'div'
    output = Mustache.render linkTemplate, @

    @content.classList.add 'link'
    @content.innerHTML = output

    if @saved then @content.classList.add 'saved'

    @content.addEventListener 'click', (e) =>
      src = e.srcElement

      ancestor = (el, cls) ->
        parent = el.parentElement

        if !parent then return null
        else if parent.classList.contains cls then return parent
        else return ancestor parent, cls

      if src.classList.contains('expand-button') or src.parentElement.classList.contains('expand-button')
        controls = ancestor src, 'controls'
        alreadyExpanded =  [].slice.call(document.querySelectorAll('#twitchlinks-link-list .controls.expanded'))

        alreadyExpanded.forEach (expandedControls) ->
          if expandedControls isnt controls then expandedControls.classList.remove 'expanded'

        controls.classList.toggle 'expanded'

      else if src.classList.contains 'save-link'
        storage.saveUrl @url, =>
          @saved = true
          @content.classList.add 'saved'
          controls = ancestor src, 'controls'
          controls.classList.remove 'expanded'

      else if src.classList.contains 'unsave-link'
        storage.unsaveUrl @url, =>
          @saved = false
          @content.classList.remove 'saved'
          controls = ancestor src, 'controls'
          controls.classList.remove 'expanded'

      else if src.classList.contains 'hide-link'
        storage.hideUrl @url, =>
          @hidden = true
          @content.classList.add 'hidden'
          controls = ancestor src, 'controls'
          controls.classList.remove 'expanded'



module.exports = Link
