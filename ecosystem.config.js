module.exports = {
  apps : [{
    name: 'Pinnaclebot',
    script: 'index.js',
    watch: '.',
    watch_delay: 10000,
    error_file: './log/err.log',
    out_file: './log/out.log',
    ignore_watch: ['log', './globals*.json', '.git', '.git/*'],
    kill_timeout: 20000
  }]
};
