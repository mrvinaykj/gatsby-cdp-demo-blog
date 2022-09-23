"use strict";

exports.pluginOptionsSchema = function (_ref) {
  var Joi = _ref.Joi;
  return Joi.object({
    clientKey: Joi.string().required().description("The client key provided by Sitecore CDP."),
    cookieDomain: Joi.string().required().description("Top level cookie domain of the website that is being integrated e.g \".example.com\" and not \"www.example.com\"."),
    apiEndpoint: Joi.string().required().description("The API target endpoint specific to your data center region"),
    pointOfSale: Joi.string().required().description("The same point of sale configured in system settings."),
    clientVersion: Joi.string().default("1.4.8").description("This is the version of the Boxever JavaScript library."),
    webFlowTarget: Joi.string().default("https://d35vb5cccm4xzp.cloudfront.net").description("The path for the Amazon CloudFront CDN for Sitecore Personalize."),
    boxeverCdnTarget: Joi.string().default("https://d1mj578wat5n4o.cloudfront.net").description("The path for the Amazon CloudFront CDN for the Boxever script."),
    head: Joi.boolean().default(true).description("Include the script part in the head, defaults to true."),
    async: Joi.boolean().default(false).description("Customize the async script loading attribute."),
    defer: Joi.boolean().default(false).description("Customize the defer script loading attribute."),
    devOptions: Joi.object({
      trackDev: Joi.boolean().default(false).description("Track events in development and log events to the Console")
    }),
    logEvents: Joi.boolean().default(false).description("Log response to the events to the Console."),
    exclude: Joi.array().items(Joi.string()),
    currency: Joi.string().default("EUR").description("Currency to be used in the events"),
    language: Joi.string().default("EN").description("Language to be used in the events"),
    channel: Joi.string().default("WEB").description("The channel for the events.")
  });
};