const { onRenderBody } = require(`../gatsby-ssr`)

it(`does not crash when no devOptions is provided`, () => {
  const mocks = {
    setHeadComponents: () => null,
    setPostBodyComponents: () => null,
  }

  const options = {
    clientKey: "abcd",
    cookieDomain: "localhost",
    apiEndpoint: "https://api.boxever.com/v1.2",
    pointOfSale: "cdp-test",
  }
  onRenderBody(mocks, options)
})