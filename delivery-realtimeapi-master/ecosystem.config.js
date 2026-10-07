module.exports = {
  apps : [
    {
      name: "v2realtime",
      script: 'index.js',
      watch: true,
      merge_logs  : true
    }
  ],
  deploy : {
    production : {
      user : 'root',
      host : '159.65.182.52',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:delivery821/realtimeapi.git',
      ssh_options: 'StrictHostKeyChecking=no',
      path : '/var/www/html/teste/realtimeapi',
      'pre-deploy-local': '',
      'post-deploy' : 'git pull origin master && npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'npm i -g pm2'
    }
  }
};
