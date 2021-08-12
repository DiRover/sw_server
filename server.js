const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');
const app = new Koa();
const fetch = require('node-fetch');
const cors = require('koa2-cors');
const Router = require('koa-router');
const router = new Router();


const RandomTextGenerator=require("random-text-generator");

const faker = require('faker');
faker.locale = "fi";
/*
app.use(cors());
app.use(koaBody({json: true}));*/

app.use(cors());
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});






//задача 12.3 из AHJ WORKERS
const slow = require('koa-slow');
/*app.use(slow({
  delay: 5000
}));*/

const data = [
  {
    name: faker.fake("{{name.firstName}}"),
    description: faker.lorem.text(),
    genre: faker.music.genre()
  },
  {
    name: faker.fake("{{name.firstName}}"),
    description: faker.lorem.text(),
    genre: faker.music.genre()
  },
  {
    name: faker.fake("{{name.firstName}}"),
    description: faker.lorem.text(),
    genre: faker.music.genre()
  }
]

router.get('/data', async (ctx, next) => {
  
  ctx.response.body = data;
});



app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
