var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var logger = require('koa-logger');
var favicon = require('koa-favicon');
var session = require('koa-session');
var mount = require('koa-mount');
var graphqlHTTP = require('koa-graphql');

var webpack = require('webpack');
var webpackDevMiddleware = require('koa-webpack-dev-middleware');
var webpackHotMiddleware = require('koa-webpack-hot-middleware');
var devConfig = require('../webpack/webpack.dev');
var compile = webpack(devConfig);

var path = require('path');
var colors = require('colors');

// database
var initDB = require('./database');
initDB();

// server
var app = new Koa();
var PORT = 8080;

app.use(logger());
app.use(bodyParser());

// session
app.keys = ['resume maker'];
const sessionConfig = {
  key: 'koa:resume:sess',
  // 1 day = 8640000 ms
  maxAge: 86400000
};
app.use(session(sessionConfig, app));

// graphql
var schema = require('./graphql/schema');
app.use(mount('/graphql', graphqlHTTP((ctx) => ({
  schema: schema,
  graphiql: true
}))));

// route
var router2controller = require('./router2controller');
app.use(router2controller());

// webpack
app.use(webpackDevMiddleware(compile, {
  noInfo: false,
  publicPath: devConfig.output.publicPath,
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compile));

// static file
app.use(require('koa-static')(path.join(__dirname, '../public')));
app.use(views(path.join(__dirname, '../public'), {
  extension: 'html'
}));
app.use(favicon(__dirname + '../favicon.ico'));

// response
// return 404 to all other page outside mapping
app.use(async (ctx) => {
  await ctx.render('404.html');
});

console.log(`---------------------------\n\nListening to local port${PORT}\n\n----------------------------`.green);

app.listen(PORT);