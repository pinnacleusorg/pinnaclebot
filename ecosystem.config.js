module.exports = {
  apps : [{
    name: 'Pinnaclebot',
    script: 'index.js',
    watch: '.',
    watch_delay: 5000,
    error_file: './log/err.log',
    out_file: './log/out.log',
    ignore_watch: ['log']
  }]
};
