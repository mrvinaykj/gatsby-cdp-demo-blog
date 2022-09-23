import React from "react"
import { Minimatch } from "minimatch"

exports.onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  pluginOptions
) => {
  const devOptions = pluginOptions.devOptions || {}
  const trackDev = devOptions.trackDev || false
  if (
    process.env.NODE_ENV === `development` &&
    !trackDev &&
    process.env.NODE_ENV !== `production` &&
    process.env.NODE_ENV !== `test`
  )
    return null

  setHeadComponents([
    <link
      rel="preconnect"
      key="preconnect-boxever-cdp"
      href={pluginOptions.boxeverCdnTarget}
    />,
    <link
      rel="dns-prefetch"
      key="dns-prefetch-boxever"
      href={pluginOptions.boxeverCdnTarget}
    />,
  ])

  const excludeCdpPaths = []
  if (typeof pluginOptions.exclude !== `undefined`) {
    pluginOptions.exclude.map(exclude => {
      const mm = new Minimatch(exclude)
      excludeCdpPaths.push(mm.makeRe())
    })
  }
  // Set head to false in the config to render script in the body tag instead of the head
  const setComponents = pluginOptions.head
    ? setPostBodyComponents
    : setHeadComponents

  const renderHtml = () => `
      ${
        excludeCdpPaths.length
          ? `window.excludeCdpPaths=[${excludeCdpPaths.join(`,`)}];`
          : ``
      }
      var _boxeverq = _boxeverq || [];

    // Define the Boxever settings 
      var _boxever_settings = {
        client_key: '${pluginOptions.clientKey}',
        target: '${pluginOptions.apiEndpoint}',
        cookie_domain: '${pluginOptions.cookieDomain}',
        javascriptLibraryVersion: '${pluginOptions.clientVersion}',
        pointOfSale: '${pluginOptions.pointOfSale}',
        web_flow_target: '${pluginOptions.webFlowTarget}',
        web_flow_config: 
        { 
          async: ${pluginOptions.async}, 
          defer: ${pluginOptions.defer} 
        }
      };
    // Import the Boxever library asynchronously 
    (function() {
         var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;  
         s.src = '${pluginOptions.boxeverCdnTarget}/boxever-${
    pluginOptions.clientVersion
  }.min.js';
         var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
    })();
      `
  return setComponents([
    <script
      key={`gatsby-plugin-sitecore-cdp-config`}
      dangerouslySetInnerHTML={{ __html: renderHtml() }}
    />,
  ])
}
