Link = require './link'



class LinkManager
  constructor: (@config, @storage) ->
    @links = []

  dedupe: (newLinks) =>
    # update our newlinks
    @links.forEach (link) =>
      # by absorbing any matching link that already exists and reducing the newlinks
      newLinks = link.absorbDuplicates newLinks
    # and pass along our deduped links
    newLinks

  addLinksToDOM: (newLinks) =>
    # then get our link container and insertion point
    container = document.getElementById 'twitchlinks-link-list'

    # TODO when container not present, alternative action (not sure why/when, but it's happening)
    insertionPoint = container.firstChild
    # we are going to prepend all of our new links
    newLinks.forEach (link) =>
      # prep the link for adding to DOM
      link.createElement @storage
      # putting them at the beginning, in order
      if insertionPoint
        container.insertBefore link.content, insertionPoint
      else
        container.appendChild link.content
    # then save the new links with our existing links
    @links = newLinks.concat @links

  purgeOld: =>
    # need a timestamp to compare to
    now = new Date().getTime()
    # update our link list by filtering out old links
    @links.forEach (link) =>
      # so we only have links left that are alive
      link.purgeCheck now, @config.ageLimit

  removeDead: =>
    @links = @links.filter (link) ->
      !link.dead

  updateLinksInDOM: =>
    now = new Date().getTime()
    # for each of our links
    @links.forEach (link) =>
      # update it's viewstate
      link.updateDOM now, @config





module.exports = LinkManager
