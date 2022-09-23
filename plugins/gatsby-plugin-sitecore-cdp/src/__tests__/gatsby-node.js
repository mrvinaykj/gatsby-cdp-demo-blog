import { testPluginOptionsSchema } from "gatsby-plugin-utils";
import { pluginOptionsSchema } from "../gatsby-node";

describe(`pluginOptionsSchema`, () => {
  it(`should invalidate incorrect options`, async () => {
    const options = {
      clientKey: undefined, // Should be a string
      cookieDomain: 123, // Should be a string
      apiEndpoint: true, // Should be a string
      async: "true", // Should be a boolean
      defer: "false", // Should be a boolean
    };
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    );

    expect(isValid).toBe(false);
  });

  it(`should validate correct options`, async () => {
    const options = {
      clientKey: "abcd",
      cookieDomain: "localhost",
      apiEndpoint: "https://api.boxever.com/v1.2",
      pointOfSale: "cdp-test",
    };
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    );

    expect(isValid).toBe(true);
    expect(errors).toEqual([]);
  });
});
