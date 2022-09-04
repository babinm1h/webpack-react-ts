const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const EslintPlugin = require("eslint-webpack-plugin");

let mode = "development";
let target = "web";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  target = "browserslist";
}

const PATHS = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, "./dist"),
  entry: path.join(__dirname, "./src", "index.tsx"),
};

module.exports = {
  mode,
  target,
  devtool: "source-map",

  // точка входа
  // babel-polyfill может использовать новые встроенные модули, такие как Promise или WeakMap,методы Array.from или Object.assign
  // Для этого polyfill добавляет к глобальной области видимости, а также собственные прототипы, такие как String.
  entry: {
    main: ["@babel/polyfill", PATHS.entry],
  },

  // точка выхода
  output: {
    assetModuleFilename: "assets/[hash][ext][query]",
    path: PATHS.dist,
    clean: true,
  },

  devServer: {
    hot: isDev,
    port: 3010,
    static: PATHS.dist,
    compress: true,
  },

  optimization: {
    // сообщает Webpack о том, что нам надо, чтобы он взял всё из node_modules и поместил бы это в файл vendors~main.js
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true,
        },
      },
    },
    minimize: true,
    // Этот плагин использует terser для минимизации вашего JavaScript
    minimizer: [isProd && new TerserPlugin(), new CssMinimizerPlugin()].filter(Boolean),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/, // регулярное выражение, которое ищет все ts?x файлы
        exclude: /node_modules/, // исключает папку node_modules
        use: "ts-loader", // весь ts обрабатывается пакетом ts-loader
      },

      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }, { loader: "eslint-loader" }],
      },

      {
        test: /\.(scss|css|sass|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              //   postcssOptions: { config: "postcss.config.js" },
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      {
        test: /\.(jpg|png|svg|jpeg|gif)$/i,
        type: "asset/resource",
        exclude: /fonts/,
        loader: "image-webpack-loader",
        enforce: "pre",
        options: {
          name: "/public/[name].[ext]",
        },
      },

      {
        test: /\.(woff|eot|svg|ttf|woff2)$/,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    // Этот плагин извлекает CSS в отдельные файлы. Он создает файл CSS для каждого файла JS, который содержит CSS.
    new MiniCssExtractPlugin(),

    // Этот плагин удалит все файлы внутри output webpack папки path, а также все неиспользуемые ресурсы webpack после каждой успешной перестройки.
    new CleanWebpackPlugin(),

    // Плагин для включения hot reloading для React компонентов
    isDev && new ReactRefreshWebpackPlugin(),

    // Позволяет плагину сгенерировать для вас HTML-файл
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./src", "index.html"),
      favicon: "./public/favicon.ico",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    // eslint
    new EslintPlugin({ extensions: ["ts", "tsx", "js", "jsx"] }),
  ].filter(Boolean),

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
