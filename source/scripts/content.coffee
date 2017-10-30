# load resources
Storage = require './classes/content/storage'
Config = require './classes/content/config'
Fontawesome = require './classes/content/fontawesome'
Dropdown = require './classes/content/dropdown'
LinkManager = require './classes/content/linkmanager'
SavedManager = require './classes/content/savedmanager'
HiddenManager = require './classes/content/hiddenmanager'
Reader = require './classes/content/reader'
Status = require './classes/content/status'

Promise = require 'bluebird'



# create classes
config = new Config()
storage = new Storage()
fontawesome = new Fontawesome()
linkManager = new LinkManager config, storage
savedManager = new SavedManager()
hiddenManager = new HiddenManager()
dropdown = new Dropdown()
reader = new Reader()



# inits
fontawesome.loadFont()
savedManager.init storage, linkManager
hiddenManager.init storage, linkManager
storage.listen linkManager, savedManager, hiddenManager

console.log "TEST"

# main loop
mainLoop = ->
  # first we make dropdown if it doesn't exist
  if dropdown.exists() or dropdown.build linkManager, savedManager, hiddenManager
    # then we fetch new links
    reader.fetchNew savedManager, hiddenManager
      .then linkManager.dedupe
      .then linkManager.addLinksToDOM
      .then linkManager.purgeOld
      .then linkManager.removeDead
      .then linkManager.updateLinksInDOM
      .then dropdown.updateNotifsInDOM
      .then status.checkIn
      .catch ->
        # do nothing on error
        return false
      .finally ->
        # and schedule next
        status.lastTimeout = setTimeout mainLoop, 1000


  # if everything fails, try again later
  else
    status.lastTimeout = setTimeout mainLoop, 1000


status = new Status config, mainLoop


# and here we go!
mainLoop()

setInterval ->
  status.renderStatus()
, 1000
