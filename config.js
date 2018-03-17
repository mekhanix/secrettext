module.exports = {
    cookie_options : {
        name: 'session',
        keys: ['foobar'],
        maxAge: 24 * 60 * 60 * 1000
    },
    cron_string : {
        hourly: '*/60 * * * *',
        hourtwelve: '0 */12 * * *',
        daily: '0 0 * * *',
        weekly: '0 0 * * 0'
    }
}