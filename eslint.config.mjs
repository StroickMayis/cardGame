import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    ignores: [
      ".config/*",
      "webpack.config.js"
    ]
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];