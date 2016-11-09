import express from 'express';
import expressDeliver from 'express-deliver';
import api from './app/api';
import cms from './app/cms';

export default function(config) {
    if(config.apps.api.active) {
        //api
        console.log('>>> Starting API');

        const apiApp = express();
        const apiPort = config.apps.api.port;

        api.middlewares(apiApp);
        api.routes(apiApp);
        api.handlers(apiApp);

        expressDeliver.handlers(apiApp);

        apiApp.listen(apiPort,function(){
            console.log(`>>> API listening ${apiPort}`);
        });
    }

    if(config.apps.cms.active) {
        //cms
        console.log('>>> Starting CMS');

        const cmsApp = express();
        const cmsPort = config.apps.cms.port;

        cms.middlewares(cmsApp);
        cms.routes(cmsApp);

        cmsApp.listen(cmsPort,function(){
            console.log(`>>> CMS listening ${cmsPort}`);
        });
    }
}