/**
 * period 
 * m - minutes
 * h - hour
 * d - day
 * M - month
 * w -week 
 * 
 */

const _1min = {
    key : 4 ,
    description : "30 minutes after checkout abandoned",
    period: 'm',
    value : 1,
    cronKey : ``
}
const _2min = {
    key : 5 ,
    description : "30 minutes after checkout abandoned",
    period: 'm',
    value : 2,
    cronKey : ``
}
const _3min = {
    key : 6 ,
    description : "30 minutes after checkout abandoned",
    period: 'm',
    value : 3,
    cronKey : ``
}

const _30min = {
    key : 1 ,
    description : "30 minutes after checkout abandoned",
    period: 'm',
    value : 30,
    cronKey : ``
}

const _1day = {
    key : 2 ,
    description : "1 day after checkout abandoned",
    period: 'd',
    value : 1,
    cronKey : ``

}

const _3day = {
    key : 3 ,
    description : "3 days after checkout abandoned",
    period: 'd',
    value : 3,
    cronKey : ``

}

const scheduleConfig = {
    1 : _30min,
    2 : _1day,
    3 : _3day,
    4 : _1min,
    5  : _2min,
    6: _3min
}

module.exports = scheduleConfig