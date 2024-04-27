module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["airbnb", "airbnb/hooks", "plugin:prettier/recommended"],
  ignorePatterns: ["dist"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react/prop-types": "off",
    "import/no-extraneous-dependencies": "off",
    "no-alert": "off",
  },
};
