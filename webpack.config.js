var path = require("path");

var config = {
  // entry: ["./app.tsx"],
  entry: {
    content: "./src/content/app.tsx",
    background: "./src/background/app.ts"
  },
  output: {
    path: path.resolve(__dirname, "app/scripts"),
    filename: "[name].min.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
