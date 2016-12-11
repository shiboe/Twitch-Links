class Status
  constructor: (@config, @mainLoop) ->
    @lastCheckin = 0
    @lastTimeout = null
    @fails = 0
    @deadLimit = @config.ageLimit + 1000 # 1 second longer than mainoop

  renderStatus: ->
    now = new Date().getTime()
    el = document.getElementById 'twitchlinks-status'

    if el
      statusEls = [].slice.call document.querySelectorAll('#twitchlinks-status .status')

      statusEls.forEach (status) ->
        status.classList.remove 'show-status'

      if false and (now - @lastCheckin) < @deadLimit
        document.querySelector('#twitchlinks-status .alive').classList.add 'show-status'

      else
        if @fails < 3
          document.querySelector('#twitchlinks-status .problems').classList.add 'show-status'
        else
          document.querySelector('#twitchlinks-status .dead').classList.add 'show-status'

        @fails += 1
        clearTimeout @lastTimeout
        @lastTimeout = @mainLoop()

  checkIn: ->
    @lastCheckin = new Date().getTime()
    @fails = 0


module.exports = Status
