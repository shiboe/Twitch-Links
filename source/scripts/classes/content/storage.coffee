Promise = require 'bluebird'

class Storage
  constructor: ->
    @saved = []
    @hidden = []

    @init = new Promise (resolve, reject) =>

      gotSaved = new Promise (resolve, reject) =>
        chrome.storage.sync.get 'saved', (data) =>
          @saved = if data.saved then JSON.parse data.saved else []
          resolve()

      gotHidden = new Promise (resolve, reject) =>
        chrome.storage.sync.get 'hidden', (data) =>
          @hidden = if data.hidden then JSON.parse data.hidden else []
          resolve()

      Promise.all([gotSaved,gotHidden]).then ->
        resolve()



  listen: (linkManager, savedManager, hiddenManager) ->
    chrome.storage.onChanged.addListener (changes, namespace) =>
      console.log 'change detected', changes, namespace

      for key,value of changes
        console.log key, value
        if key is 'saved'
          @saved = JSON.parse value.newValue
          console.log 'saved changes', @saved
          savedManager.load @saved
          savedManager.build()

        else if key is 'hidden'
          @hidden = JSON.parse value.newValue
          console.log 'hidden changes', @hidden
          hiddenManager.load @hidden
          hiddenManager.build()


    # chrome.runtime.onMessage.addListener (request, sender, sendResponse) =>
    #   switch request.command
    #
    #     when 'updatedSavedUrls'
    #       savedManager.load request.data
    #       savedManager.build()
    #
    #     when 'updatedHiddenUrls'
    #       hiddenManager.load request.data
    #       hiddenManager.build()

  saveUrl: (url, callback) ->
    @init.then =>
      if @saved.indexOf(url) is -1
        @saved.push url

        chrome.storage.sync.set {'saved': JSON.stringify(@saved)}, ->
          if callback then callback @saved

  unsaveUrl: (url, callback) ->
    @init.then =>
      pos = @saved.indexOf(url)

      if pos isnt -1
        @saved.splice pos, 1

        chrome.storage.sync.set {'saved': JSON.stringify(@saved)}, ->
          if callback then callback @saved

  hideUrl: (url, callback) ->
    @init.then =>
      if @hidden.indexOf(url) is -1
        @hidden.push url

        chrome.storage.sync.set {'hidden': JSON.stringify(@hidden)}, ->
          if callback then callback @hidden

  unhideUrl: (url, callback) ->
    @init.then =>
      pos = @hidden.indexOf(url)

      if pos isnt -1
        @hidden.splice pos, 1

        chrome.storage.sync.set {'hidden': JSON.stringify(@hidden)}, ->
          if callback then callback @hidden

  getSavedUrls: (callback) ->
    @init.then => 
      callback @saved

  getHiddenUrls: (callback) ->
    @init.then => 
      callback @hidden


module.exports = Storage
