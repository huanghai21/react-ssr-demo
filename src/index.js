import 'babel-polyfill';
import express from 'express';
import proxy from 'express-http-proxy';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();
const PORT = 3000;

app.use(
  '/api',
  proxy('http://react-ssr-api.herokuapp.com', {
    // opts.headers['x-forward-host'] = `localhost:${PORT}`;
    proxyReqOptDecorator (opts) {
      opts.headers['x-forward-host'] = `localhost:3000`;
      return opts;
    }
  }));

app.use(express.static('public'));

app.get('*', async (req, res) => {
  const store = createStore(req);
  console.log(req.path, 'matchRoutes', matchRoutes(Routes, req.path));
  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => (route.loadData ? route.loadData(store) : null))
    .filter(item => item instanceof Promise)
    .map(promiseInstance => {
      return new Promise((resolve, reject) => {
        // extract promiseInstance: covert reject to resolve 
        // so the Promise.all will NOT be broken even occured
        // a reject error
        promiseInstance.then(resolve).catch(resolve);
      });
    });

  console.log('promises', promises);
  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req, store, context);
    console.log(`🚀 ~ file: index.js ~ line 42 ~ Promise.all ~ context`, context)

    if (context.url) {
      return res.redirect(301, context.url);
    }
    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });
});

app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});