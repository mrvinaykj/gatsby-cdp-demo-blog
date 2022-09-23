"use strict";

exports.onRouteUpdate = function (_ref, pluginOptions) {
  var location = _ref.location;
  var devOptions = pluginOptions.devOptions || {};
  var trackDev = devOptions.trackDev || false;
  if (process.env.NODE_ENV === "development" && !trackDev && process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") return null;
  var pathIsExcluded = location && typeof window.excludeCdpPaths !== "undefined" && window.excludeCdpPaths.some(function (rx) {
    return rx.test(location.pathname);
  });
  if (pathIsExcluded) return null;
  var logEvents = pluginOptions.logEvents;
  var Boxever = window.Boxever;
  var eventSettings = {
    LogEvents: logEvents,
    Currency: pluginOptions.currency,
    Language: pluginOptions.language,
    Channel: pluginOptions.channel
  }; // This is to make the plugin also compatible with the react-sitecore-personalize module

  window.__eventSettings = eventSettings;

  var sendViewEvent = function sendViewEvent(pagePath) {
    var viewEvent = Boxever.addUTMParams({
      browser_id: Boxever.getID(),
      channel: eventSettings.Channel,
      type: "VIEW",
      language: eventSettings.Language,
      currency: eventSettings.Currency,
      page: pagePath,
      pos: pluginOptions.pointOfSale
    });

    if (trackDev) {
      console.log("Boxever VIEW event triggered");
      console.log(viewEvent);
    } // Send the event data to the server


    Boxever.eventCreate(viewEvent, function (response) {
      if (logEvents || trackDev) {
        console.log("Boxever VIEW event response");
        console.log(response);
      }
    }, "json");
  }; // wrap inside a timeout to make sure react-helmet is done with its changes (https://github.com/gatsbyjs/gatsby/issues/11592)


  var sendPageView = function sendPageView() {
    var pagePath = location ? location.pathname + location.search + location.hash : undefined;
    sendViewEvent(pagePath);
  };

  if ("requestAnimationFrame" in window) {
    requestAnimationFrame(function () {
      requestAnimationFrame(sendPageView);
    });
  } else {
    // simulate 2 rAF calls
    setTimeout(sendPageView, 32);
  }

  return null;
};