export default {
  theme: "./src/theme.js",
  "publicPath": "/static/",
  "proxy": {
    "/api": {
      "target": "http://jsonplaceholder.typicode.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
}
