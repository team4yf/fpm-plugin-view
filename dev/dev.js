'use strict';
const { Fpm } = require('yf-fpm-server');
const plugin = require('../src');
let app = new Fpm()
const ref = plugin.bind(app)
console.info('the plugin ref:', ref)
let biz = app.createBiz('0.0.1');

biz.addSubModules('demo',{
    foo: (args) => {
        console.log('demo.foo called', args)
        return Promise.reject('foo.bar reject')
    }
})
app.addBizModules(biz);
app.run()