import presetEnv from "@babel/preset-env";
import presetTypescript from "@babel/preset-typescript";
import presetReact from "@babel/preset-react";

import proposalClassProperties from "@babel/plugin-proposal-class-properties";
import proposalObjectRestSpread from "@babel/plugin-proposal-object-rest-spread";
import proposalExportDefaultFrom from "@babel/plugin-proposal-export-default-from";
import proposalExportNamespaceFrom from "@babel/plugin-proposal-export-namespace-from";
import syntaxDynamicImport from "@babel/plugin-syntax-dynamic-import";
import transformImports from "babel-plugin-transform-imports";
import emotion from "@emotion/babel-plugin";

export default (api, options) => {
  return {
    presets: [
      [presetEnv, { targets: { node: "10" }, ...options }],
      [presetTypescript, {}],
      [presetReact, {}]
    ],
    env: {
      test: {
        plugins: [
          [emotion, { cssPropOptimization: false }],
          [proposalClassProperties, {}],
          [proposalObjectRestSpread, {}],
          [proposalExportDefaultFrom, {}],
          [proposalExportNamespaceFrom, {}],
          [syntaxDynamicImport, {}],
          [
            transformImports,
            {
              "@fortawesome/free-brands-svg-icons": {
                transform: "@fortawesome/free-brands-svg-icons/${member}",
                skipDefaultConversion: true
              },
              "@geospatial/pro-regular-svg-icons": {
                transform: "@geospatial/pro-regular-svg-icons/${member}",
                skipDefaultConversion: true
              },
              "@geospatial/pro-solid-svg-icons": {
                transform: "@geospatial/pro-solid-svg-icons/${member}",
                skipDefaultConversion: true
              },
              "@geospatial/pro-light-svg-icons": {
                transform: "@geospatial/pro-light-svg-icons/${member}",
                skipDefaultConversion: true
              }
            }
          ]
        ]
      }
    },
    plugins: [
      [emotion, { cssPropOptimization: false }],
      [proposalClassProperties, {}],
      [proposalObjectRestSpread, {}],
      [proposalExportDefaultFrom, {}],
      [proposalExportNamespaceFrom, {}],
      [syntaxDynamicImport, {}],
      [
        transformImports,
        {
          "@fortawesome/free-brands-svg-icons": {
            transform: "@fortawesome/free-brands-svg-icons/${member}",
            skipDefaultConversion: true
          },
          "@geospatial/pro-regular-svg-icons": {
            transform: "@geospatial/pro-regular-svg-icons/${member}",
            skipDefaultConversion: true
          },
          "@geospatial/pro-solid-svg-icons": {
            transform: "@geospatial/pro-solid-svg-icons/${member}",
            skipDefaultConversion: true
          },
          "@geospatial/pro-light-svg-icons": {
            transform: "@geospatial/pro-light-svg-icons/${member}",
            skipDefaultConversion: true
          }
        }
      ]
    ].filter(el => el != null)
  };
};
