// @babel/preset-env — это умный пресет, который подключает только те плагины, которые нужны, основываясь на браузерах, которые поддерживает конкретный проект

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
  plugins: [isDev && "react-refresh/babel", "@babel/plugin-proposal-class-properties"].filter(Boolean),
};
