function model() {
  const apiPrefix = 'api/v1/';
  return {
    namespaces: [],
    namespace: 'default',
    deployments: [],
    isConfigOpen: false,
    isReviewOpen: false,
    isLoading: false,
    agentVersions: [],
    agent: '',
    collectorHost: '',
    collectorPort: '',
    patches: [],
    search: '',
    error: '',

    init() {
      fetch(apiPrefix + 'namespaces')
      .then(response => {
        if (!response.ok) {
          this.error = 'Error fetching namespaces';
          return {body: {items:[]}};
        } else {
          return response.json();
        }
      })
      .then(data => this.namespaces = data.body.items)
      .catch(error => {
        console.error(error);
      });

      this.fetchDeployments();
      this.fetchAgentVersions();
    },

    fetchDeployments() {
      fetch(`${apiPrefix}namespaces/${this.namespace}/deployments`)
      .then(response => {
        if (!response.ok) {
          this.error = 'Error fetching deployments';
          return {body: {items:[]}};
        } else {
          return response.json();
        }
      })
      .then(data => {
          this.deployments = data.body.items;

          this.deployments.forEach(deployment => {
            deployment.spec.template.spec.containers.forEach(container => {
              // disable patching of overops images
              if (container.image.startsWith('overops/')) {
                deployment.disabled = true;
              }
              // find takipi env vars
              if (container.env) {
                container.env.forEach(env => {
                  switch(env.name) {
                    case 'TAKIPI_APPLICATION_NAME':
                      container.ENV_TAKIPI_APPLICATION_NAME = env.value; // preserve existing name
                      container.TAKIPI_APPLICATION_NAME = env.value; // editable name used in patch
                      break;
                    case 'TAKIPI_DEPLOYMENT_NAME':
                      container.ENV_TAKIPI_DEPLOYMENT_NAME = env.value;
                      container.TAKIPI_DEPLOYMENT_NAME = env.value;
                      break;
                    // collector host and port are displayed per container but set globally
                    case 'TAKIPI_COLLECTOR_HOST': container.ENV_TAKIPI_COLLECTOR_HOST = env.value; break;
                    case 'TAKIPI_COLLECTOR_PORT': container.ENV_TAKIPI_COLLECTOR_PORT = env.value; break;
                  }
                });
              }
            });
          });

        })
        .catch(error => {
          console.error(error);
        });
    },

    fetchAgentVersions() {
      fetch(apiPrefix + '/repositories/overops/agent-sidecar/tags')
        .then(response => {
          if (!response.ok) {
            this.error = 'Error fetching overops/agent-sidecar tags';
            return [{name: '--'}];
          } else {
            return response.json();
          }
        })
        .then(data => {
          this.agentVersions = data;
          this.agent = data[0].name;
        })
        .catch(error => {
          console.error(error);
        });
    },

    setNamespace(namespace) {
      this.namespace = namespace;
      this.fetchDeployments();
    },

    get filteredDeployments () {
      if (this.search === '') return this.deployments;

      return this.deployments.filter(deployment => {
        return deployment.metadata.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },

    get numChecked() {
      let numChecked = 0;
      this.deployments.forEach(deployment => {
        deployment.spec.template.spec.containers.forEach(container => {
          if (container.isChecked) numChecked++;
        });
      });
      return numChecked;
    },

    toggleDeployment(d) {
      this.deployments[d].isChecked = !this.deployments[d].isChecked;

      this.deployments[d].spec.template.spec.containers.forEach(container => {
        container.isChecked = this.deployments[d].isChecked;
      });
    },

    toggleContainer(d,c) {
      this.deployments[d].spec.template.spec.containers[c].isChecked = 
        !this.deployments[d].spec.template.spec.containers[c].isChecked;

      let allContainersChecked = true;

      this.deployments[d].spec.template.spec.containers.forEach(container => {
        allContainersChecked = allContainersChecked && container.isChecked;
      });

      this.deployments[d].isChecked = allContainersChecked;
    },

    createPatch(disable) {
      let deployments = [];

      this.deployments.forEach(deployment => {
        let dep = {
          name: deployment.metadata.name,
          agent: this.agent,
          disable: disable,
          containers: []
        };

        deployment.spec.template.spec.containers.forEach(container => {
          if (container.isChecked) {
            let con = {
              name: container.name,
              env: [
                {
                  name: 'TAKIPI_COLLECTOR_HOST',
                  value: (disable ? null : this.collectorHost || 'overops-collector-service')
                },
                {
                  name: 'TAKIPI_COLLECTOR_PORT',
                  value: (disable ? null : this.collectorPort || '6060')
                }
              ]
            };

            if (disable) {
              con.env.push({
                name: 'TAKIPI_APPLICATION_NAME',
                value: null
              });
            } else if (container.TAKIPI_APPLICATION_NAME && container.TAKIPI_APPLICATION_NAME.trim() !== "") {
              con.env.push({
                name: 'TAKIPI_APPLICATION_NAME',
                value: container.TAKIPI_APPLICATION_NAME.trim()
              });
            }

            if (disable) {
              con.env.push({
                name: 'TAKIPI_DEPLOYMENT_NAME',
                value: null
              });
            } else if (container.TAKIPI_DEPLOYMENT_NAME && container.TAKIPI_DEPLOYMENT_NAME.trim() !== "") {
              con.env.push({
                name: 'TAKIPI_DEPLOYMENT_NAME',
                value: container.TAKIPI_DEPLOYMENT_NAME.trim()
              });
            }

            dep.containers.push(con);
          }
        });

        if (dep.containers.length > 0) {
          deployments.push(dep);
        }

      });

      this.patches = deployments;
    },

    applyPatch() {
      this.isLoading = true;
      let patches = [];
      this.patches.forEach(patch => {
        patches.push(
          fetch(`${apiPrefix}namespaces/${this.namespace}/deployments/${patch.name}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(patch)
            }
          )
        );
      });

      Promise.all(patches)
        .then(response => {
          response.forEach(res => {
            if (!res.ok) {
              this.error = 'Error applying patch';
            }
          })
        })
        .then(() => {
          this.isReviewOpen = false;
          this.isLoading = false;
          this.fetchDeployments();
        });
    }

  }
}
