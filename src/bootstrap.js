export default function() {
    //api
    if(config.apps.active == 'api') {
        import api from './app/api';
        const apiApp = express();
        const apiPort = config.apps.api.port;

        api.middlewares(apiApp);
        api.routes(apiApp);
        api.handlers(apiApp);

        expressDeliver.handlers(apiApp);

        apiApp.listen(apiPort,function(){
            console.log(`>>> API http listening ${apiPort}`);
        });
    }


    //cms
    import cms from './app/cms';
    const cmsApp = express();
    const cmsPort = config.apps.cms.port;

    cms.middlewares(cmsApp);
    cms.routes(cmsApp);

    cmsApp.listen(cmsPort,function(){
        console.log(`>>> CMS http listening ${cmsPort}`);
    });
}