"use strict";
const _ = require('lodash');
const path = require('path');
const Views = require('koa-views');
const Static = require('koa-static');

module.exports = {
  bind: (fpm) => {

    const root_dir = fpm.get('CWD');
    const app = fpm.app

    fpm.registerAction('BEFORE_SERVER_START', () => {
      
      const { prefix, asset, views } = fpm.getConfig('view', {
        asset: 'public',
        views: 'views',
        perfix: 'a',
      })
      app.use(Views(path.join(root_dir, views), {
        extension: 'html',
        map: { html: 'nunjucks' },
      }))
      app.use(Static(path.join(root_dir, asset)))

      const router = fpm.createRouter();

      router.get(`/${prefix}`, async ctx => {
        try{
          await ctx.render('index.html');
        }catch(e){
          console.log(e)
          const showError = fpm.get('debug') === true ? {error: e.toString()} : {};
          await ctx.render('404.html', showError);
        }
      });

      router.get(`/${prefix}/:page`, async ctx => {
        try{
          let { page } = ctx.params;
          if(page.indexOf('.')>0){
            return;
          }
          page = page.replace(/-/g, '/')
          await ctx.render(`${page}.html`);
        }catch(e){
          const showError = fpm.get('debug') === true ? {error: e.toString()} : {};
          await ctx.render('404.html', showError);
        }
      });

      fpm.bindRouter(router);
    });

    
    
    
    

    fpm.registerAction('BEFORE_SERVER_START', () => {
      // fpm.extendModule('job', bizModule)
    });
    return;

  }
}