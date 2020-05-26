const fs = require('fs');
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const Client = require('kubernetes-client').Client;
const fetch = require('node-fetch');

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

  try {
    await client.loadSpec();

    ctx.type = 'json';
    ctx.body = await client.api.v1.namespaces.get();

  } catch (error) {
    console.error('Error getting namespaces');
    ctx.throw('500');
  }
});

router.get(apiPrefix + 'namespaces/:namespace/deployments', async (ctx, next) => {
  await next();

  try {
    await client.loadSpec();

    const namespace = ctx.params.namespace;
  
    ctx.type = 'json';
    ctx.body = await client.apis.apps.v1.namespaces(namespace).deployments().get();

  } catch (error) {
    console.error('Error getting deployments');
    ctx.throw('500');
  }
});

router.patch(apiPrefix + 'namespaces/:namespace/deployments/:deployment', async (ctx, next) => {
  await next();

  try {
    await client.loadSpec();

    const namespace = ctx.params.namespace;
    const deployment = ctx.params.deployment;
    const agent = ctx.request.body.agent;
    const disable = ctx.request.body.disable;
  
    const javaToolOptions = (disable ? null : '-agentpath:/takipi/lib/libTakipiAgent.so');
  
    let containers = ctx.request.body.containers;
    containers.forEach(container => {
      container.volumeMounts = [{
        name: 'overops-agent',
        mountPath: '/takipi'
      }];
      container.env.push({
        name: 'JAVA_TOOL_OPTIONS',
        value: javaToolOptions
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
                image: 'overops/agent-sidecar:' + agent,
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

  } catch (error) {
    console.error('Error patching deployment');
    ctx.throw('500');
  }
});

router.get(apiPrefix + 'repositories/overops/agent-sidecar/tags', async (ctx, next) => {
  await next();

  try {
    await client.loadSpec();

    // get tags for overops/agent-sidecar from docker hub
    const response = await fetch('https://registry.hub.docker.com/v1/repositories/overops/agent-sidecar/tags');
    let data = await response.json();

    // sort by latest
    data.sort(function(a, b) {
      // push alpine versions to the bottom
      if (a.name.startsWith('alpine') && !b.name.startsWith('alpine')) {
        return 1;
      }
      if (!a.name.startsWith('alpine') && b.name.startsWith('alpine')) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      if (a.name > b.name) {
        return -1;
      }
      return 0;
    });

    // remove 'latest' and 'debug' versions
    data = data.filter(tag => tag.name !== 'latest' && tag.name !== 'debug');

    // return tags
    ctx.type = 'json';
    ctx.body = data;

  } catch (error) {
    console.error('Error getting overops/agent-sidecar/tags from docker hub');
    ctx.throw('500');
  }
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(require('koa-static')(__dirname + '/resources'));

app.listen(3000);
