module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '3019',
      exec_mode: 'fork',
      instances: '2',
      script: './.output/server/index.mjs'
    }
  ]
}
