exports.onRouteUpdate = ({ location }, pluginOptions) => {
  const devOptions = pluginOptions.devOptions || {}
  const trackDev = devOptions.trackDev || false
  if (
    process.env.NODE_ENV === `development` &&
    !trackDev &&
    process.env.NODE_ENV !== `production` &&
    process.env.NODE_ENV !== `test`
  )
    return null

  const pathIsExcluded =
    location &&
    typeof window.excludeCdpPaths !== `undefined` &&
    window.excludeCdpPaths.some(rx => rx.test(location.pathname))

  if (pathIsExcluded) return null

  const logEvents = pluginOptions.logEvents

  const Boxever = window.Boxever

  const eventSettings = {
    LogEvents: logEvents,
    Currency: pluginOptions.currency,
    Language: pluginOptions.language,
    Channel: pluginOptions.channel,
  }

  // This is to make the plugin also compatible with the react-sitecore-personalize module
  window.__eventSettings = eventSettings

  const sendViewEvent = pagePath => {
    const viewEvent = Boxever.addUTMParams({
      browser_id: Boxever.getID(),
      channel: eventSettings.Channel,
      type: "VIEW",
      language: eventSettings.Language,
      currency: eventSettings.Currency,
      page: pagePath,
      pos: pluginOptions.pointOfSale,
    })
    if (trackDev) {
      console.log("Boxever VIEW event triggered")
      console.log(viewEvent)
    }
    // Send the event data to the server
    Boxever.eventCreate(
      viewEvent,
      response => {
        if (logEvents || trackDev) {
          console.log("Boxever VIEW event response")
          console.log(response)
        }
      },
      "json"
    )
  }

  // wrap inside a timeout to make sure react-helmet is done with its changes (https://github.com/gatsbyjs/gatsby/issues/11592)
  const sendPageView = () => {
    const pagePath = location
      ? location.pathname + location.search + location.hash
      : undefined
    sendViewEvent(pagePath)
  }

  if (`requestAnimationFrame` in window) {
    requestAnimationFrame(() => {
      requestAnimationFrame(sendPageView)
    })
  } else {
    // simulate 2 rAF calls
    setTimeout(sendPageView, 32)
  }

  return null
}
