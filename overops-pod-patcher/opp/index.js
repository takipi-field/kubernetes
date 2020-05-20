const fs = require('fs');
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const Client = require('kubernetes-client').Client;

const app = new Koa();
const router = new Router();
const client = new Client();

const apiPrefix = '/api/v1/';

// trust proxy headers
app.proxy = true;

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`[${ctx.status}] ${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

router.get(apiPrefix + 'namespaces', async (ctx, next) => {
  await next();
  await client.loadSpec();

  ctx.type = 'json';
  ctx.body = await client.api.v1.namespaces.get();
});

router.get(apiPrefix + 'namespaces/:namespace/deployments', async (ctx, next) => {
  await next();
  await client.loadSpec();

  const namespace = ctx.params.namespace;

  ctx.type = 'json';
  ctx.body = await client.apis.apps.v1.namespaces(namespace).deployments().get();
});

router.patch(apiPrefix + 'namespaces/:namespace/deployments/:deployment', async (ctx, next) => {
  await next();
  await client.loadSpec();

  const namespace = ctx.params.namespace;
  const deployment = ctx.params.deployment;

  let containers = ctx.request.body.containers;
  containers.forEach(container => {
    container.volumeMounts = [{
      name: 'overops-agent',
      mountPath: '/takipi'
    }];
    container.env.push({
      name: 'JAVA_TOOL_OPTIONS',
      value:'-agentpath:/takipi/lib/libTakipiAgent.so'
    });
  });

  ctx.type = 'json';
  ctx.body = await client.apis.apps.v1.namespaces(namespace).deployments(deployment).patch({
    body: {
      spec: {
        template: {
          spec: {
            volumes: [{
              name: "overops-agent",
              emptyDir: {}
            }],
            initContainers: [{
              name: 'overops-agent',
              image: 'overops/agent-sidecar:4.50.2',
              imagePullPolicy: 'IfNotPresent',
              resources: {
                requests: {
                  cpu: '10m',
                  memory: '10Mi'
                },
                limits: {
                  cpu: '100m',
                  memory: '100Mi'
                }
              },
              volumeMounts: [{
                name: 'overops-agent',
                mountPath: '/takipi'
              }]
            }],
            containers: containers
          }
        }
      }
    }
  });
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(__dirname + '/resources'));

app.listen(3000);
