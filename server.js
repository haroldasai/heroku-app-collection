var Hapi = require('hapi'),
    path = require('path'),
    port = process.env.PORT || 8080,
    server = new Hapi.Server(port),
    routes = {
        angularChatCss: {
            method: 'GET',
            path: '/angular-chat/styles/{path*}',
            handler: createDirectoryRoute('angular-chat/app/styles')
        },
        angularChatJs: {
            method: 'GET',
            path: '/angular-chat/scripts/{path*}',
            handler: createDirectoryRoute('angular-chat/app/scripts')
        },
        angularChatAssets: {
            method: 'GET',
            path: '/angular-chat/assets/{path*}',
            handler: createDirectoryRoute('angular-chat/app/assets')
        },
        angularChatTemplates: {
            method: 'GET',
            path: '/angular-chat/templates/{path*}',
            handler: createDirectoryRoute('angular-chat/app/templates')
        },
        //spa: {
        //    method: 'GET',
        //    path: '/{path*}',
        //    handler: {
        //        file: path.join(__dirname, '/app/index.html')
        //    }
        //},
        angularChatBase: {
            method: 'GET',
            path: '/angular-chat/{path*}',
            handler: {
                file: path.join(__dirname, '/app-collection/angular-chat/app/index.html')
            }
        },

        angularRecordsCss: {
            method: 'GET',
            path: '/angular-records/styles/{path*}',
            handler: createDirectoryRoute('angular-records/app/styles')
        },
        angularRecordsJs: {
            method: 'GET',
            path: '/angular-records/scripts/{path*}',
            handler: createDirectoryRoute('angular-records/app/scripts')
        },
        angularRecordsAssets: {
            method: 'GET',
            path: '/angular-records/assets/{path*}',
            handler: createDirectoryRoute('angular-records/app/assets')
        },
        angularRecordsTemplates: {
            method: 'GET',
            path: '/angular-records/templates/{path*}',
            handler: createDirectoryRoute('angular-records/app/templates')
        },
        //spa: {
        //    method: 'GET',
        //    path: '/{path*}',
        //    handler: {
        //        file: path.join(__dirname, '/app/index.html')
        //    }
        //},
        angularRecordsBase: {
            method: 'GET',
            path: '/angular-records/{path*}',
            handler: {
                file: path.join(__dirname, '/app-collection/angular-records/app/index.html')
            }
        }


    };

server.route([ routes.angularChatCss, routes.angularChatJs, routes.angularChatAssets, routes.angularChatTemplates, routes.angularChatBase,
               routes.angularRecordsCss, routes.angularRecordsJs, routes.angularRecordsAssets, routes.angularRecordsTemplates, routes.angularRecordsBase
]);

server.start( onServerStarted );

server.on('response', function (request) {
    if(request.url.path.includes('templates')) {
        console.log();
        console.log(new Date().toString() + ':  ' + request.method.toUpperCase() + ' - ' + request.url.path + ' - (' + request.response.statusCode + ')');
    }
});

function onServerStarted() {
    console.log( 'Server running on port ', port );
}

function createDirectoryRoute(directory) {
    return {
        directory: {
            path: path.join(__dirname, '/app-collection/', directory)
        }
    };
}

module.exports = server;
