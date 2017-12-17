Link = require './link'
Promise = require 'bluebird'



class Reader
  constructor: ->
    @lastLine = null

  fetchNew: (savedManager, hiddenManager) =>
    # return a promise of all links in this fetch
    new Promise (resolve, reject) =>
      count = 0
      # get our twitch line container that we will parse for links, exit if we can't find it
      liveChatLine = document.querySelector '.chat-list__lines .chat-line__message'
      onDemandChatLine = document.querySelector '.video-chat__message-list-wrapper ul li'

      firstChatLine = liveChatLine or onDemandChatLine
      # if there's no first line to read, exit, returning no new lines
      if !firstChatLine
        reject new Error('no lines found')
        return
      # start a queue of links that will be returned
      linkQueue = []
      # then establish a looping function that fetches a line and adds it's links to queue
      fetchLineLinks = =>
        # clear lines if no longer in the DOM so we don't get stuck
        @lastLine = if @isInDOM @lastLine then @lastLine else null
        firstChatLine = if @isInDOM firstChatLine then firstChatLine else null
        # first we get the next line, based off the last line checked, so we don't repeat
        nextLine = if @lastLine then @getNextLine() else firstChatLine
        # then update the last line to current, so we always move forward
        @lastLine = nextLine or @lastLine
        # while there's a next line
        if nextLine
          # get all unique links from the line
          links = @getLinksFromLine nextLine, savedManager, hiddenManager
          # determine which links are not yet queued
          newLinks = links.filter (link) ->
            alreadyQueued = linkQueue.filter (queuedLink) ->
              queuedLink.url is link.url

            !alreadyQueued.length
          # and add those new links to the queue
          linkQueue = linkQueue.concat newLinks
          # then move on to the next line
          requestAnimationFrame fetchLineLinks
        # until there is no longer a next line and we have links
        else
          if window.twitchlinksDebug == true then console.log 'resolving new links', linkQueue
          resolve linkQueue
      # start reading
      fetchLineLinks()


  getNextLine: ->
    @lastLine.nextElementSibling

  getLinksFromLine: (line, savedManager, hiddenManager) ->
    uniqueUrls = []

    author = line.querySelector('.chat-author__display-name')?.innerHTML
    urls = [].slice.call(line.querySelectorAll('.chat-line__message--link')).map (anchorLink) =>
      @normalizeUrl anchorLink.getAttribute 'href'

    # also check for clips
    clip = line.querySelector('.chat-card__link')
    if clip then urls.push( @normalizeUrl clip.getAttribute('href').split('?')[0] )

    urls.forEach (url) ->
      if uniqueUrls.indexOf(url) is -1 then uniqueUrls.push url

    uniqueUrls.map (url) ->
      isSaved = savedManager.isSaved url
      isHidden = hiddenManager.isHidden url

      new Link url, author, isSaved, isHidden

  normalizeUrl: (url) ->
    try
      repeats = url.split(/https?:\/\//).splice(1)
      ssl = url[4] is 's'
      first = repeats.pop()

      if repeats.length
        while repeats.length
          next = repeats.pop()
          if next isnt first
            return url

        protocol = if ssl then 'https' else 'http'

        if repeats.length is 0
          url = "#{protocol}://#{first}"

    catch e
      console.log 'FAILED', url
      console.log e
      throw e

    return url

  isInDOM: (el) ->
    if !el then return false
    if el.tagName is 'BODY' then return true

    return @isInDOM el.parentElement

module.exports = Reader
