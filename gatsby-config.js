require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  flags: {
    DEV_SSR: true
  },
  siteMetadata: {
    title: `Gatsby Starter Blog`,
    author: {
      name: `Vinay Jadav`,
      summary: `Sitecore Developer`,
    },
    description: `A starter blog demonstrating what Sitecore CDP can do with a Gatsby site`,
    siteUrl: `https://gatsbycdpdemoblogmain.gatsbyjs.io/`,
    social: {
      twitter: `mrvinaykj`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', disallow: ['/'] }]
      }
    },
    {
      resolve: `gatsby-plugin-sitecore-cdp`,
      options: {
        clientKey: process.env.CDP_CLIENT_KEY,
        cookieDomain: "cdpdemo.vinayjadav.com",
        // Change to the api endpoint for your region
        apiEndpoint: "https://api.boxever.com/v1.2", 
        pointOfSale: "vinay-test",
        // The below options are optional
        // The Javascript SDK Client version, defaults to 1.4.8
        clientVersion: "1.4.8",
        // The webflow CDN to be used for Sitecore Personalize, the below value will be the default
        webFlowTarget: "https://d35vb5cccm4xzp.cloudfront.net",
        // The Boxever Script CDN for the JS file, the below value will be the default
        boxeverCdnTarget: "https://d1mj578wat5n4o.cloudfront.net",
        // Set value to false, if you want the script to be in the body tag instead of head
        head: true,
        // The async value for the boxever script, false by default
        async: false,
        // The defer value for the boxever script, false by default
        defer: false,
        // DevOptions will be used for local dev configuration
        devOptions: {
        // Use this to log events to the console
          trackDev: true
        },
        // Exclude the paths that you do not want to track
        exclude: ["/hello-world/"]
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Gatsby Starter Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    
  ],
}
