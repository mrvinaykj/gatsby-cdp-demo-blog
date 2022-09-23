"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _minimatch = require("minimatch");

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents,
      setPostBodyComponents = _ref.setPostBodyComponents;
  var devOptions = pluginOptions.devOptions || {};
  var trackDev = devOptions.trackDev || false;
  if (process.env.NODE_ENV === "development" && !trackDev && process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") return null;
  setHeadComponents([/*#__PURE__*/_react.default.createElement("link", {
    rel: "preconnect",
    key: "preconnect-boxever-cdp",
    href: pluginOptions.boxeverCdnTarget
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "dns-prefetch",
    key: "dns-prefetch-boxever",
    href: pluginOptions.boxeverCdnTarget
  })]);
  var excludeCdpPaths = [];

  if (typeof pluginOptions.exclude !== "undefined") {
    pluginOptions.exclude.map(function (exclude) {
      var mm = new _minimatch.Minimatch(exclude);
      excludeCdpPaths.push(mm.makeRe());
    });
  } // Set head to false in the config to render script in the body tag instead of the head


  var setComponents = pluginOptions.head ? setPostBodyComponents : setHeadComponents;

  var renderHtml = function renderHtml() {
    return "\n      " + (excludeCdpPaths.length ? "window.excludeCdpPaths=[" + excludeCdpPaths.join(",") + "];" : "") + "\n      var _boxeverq = _boxeverq || [];\n\n    // Define the Boxever settings \n      var _boxever_settings = {\n        client_key: '" + pluginOptions.clientKey + "',\n        target: '" + pluginOptions.apiEndpoint + "',\n        cookie_domain: '" + pluginOptions.cookieDomain + "',\n        javascriptLibraryVersion: '" + pluginOptions.clientVersion + "',\n        pointOfSale: '" + pluginOptions.pointOfSale + "',\n        web_flow_target: '" + pluginOptions.webFlowTarget + "',\n        web_flow_config: \n        { \n          async: " + pluginOptions.async + ", \n          defer: " + pluginOptions.defer + " \n        }\n      };\n    // Import the Boxever library asynchronously \n    (function() {\n         var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;  \n         s.src = '" + pluginOptions.boxeverCdnTarget + "/boxever-" + pluginOptions.clientVersion + ".min.js';\n         var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);\n    })();\n      ";
  };

  return setComponents([/*#__PURE__*/_react.default.createElement("script", {
    key: "gatsby-plugin-sitecore-cdp-config",
    dangerouslySetInnerHTML: {
      __html: renderHtml()
    }
  })]);
};