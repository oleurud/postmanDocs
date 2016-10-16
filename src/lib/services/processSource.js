import fs from 'fs';
import config from '~/src/lib/config';
import { Source } from '~/src/lib/models';
import { HTTPCallsGenerator } from '~/src/lib/services';

export default function(collectionName, sourceFile, url) {
    let filePath = config.tmpFolder + sourceFile.name;

    return new Promise( (resolve, reject) => {
        sourceFile.mv(filePath, function(err) {
            if(err) {
                reject({
                    error: 'Error processing file'
                })
            }

            resolve(
                new Promise( (resolve, reject) => {
                    fs.readFile(filePath, 'utf8', function(err, data) {
                        data = JSON.parse(data);

                        if(err || !data || !data.info || !data.item) {
                            reject({
                                error: 'Error reading file'
                            })
                        }

                        resolve(
                            Source.findOne({ name: collectionName }).then((existingCollection) => {
                                if(existingCollection) {
                                    return {
                                        error: 'The collection already exists'
                                    }
                                }

                                let source = new Source({
                                    name: collectionName,
                                    description: data.info.description,
                                    data: processData(data.item, url)
                                });

                                return source.save().then(() => {
                                    return {
                                        message: 'Collection saved'
                                    }
                                });
                            })
                        )
                    });
                })
            )
        });
    });
};

function processData(dataSource, url) {
    return dataSource.map( (endpointGroup) => {
        let endpoints = [];

        if(endpointGroup.item) {
            //folder of endpoints
            endpoints = endpoints.concat(
                endpointGroup.item.map((endpoint) => {
                    return {
                        name: endpoint.name,
                        request: processRequest(endpoint.request, url),
                        response: processResponse(endpoint.response)
                    }
                })
            );

        } else {
            //endpoint without folder
            endpoints = endpoints.concat({
                name: endpointGroup.name,
                request: processRequest(endpointGroup.request, url),
                response: processResponse(endpointGroup.response)
            });
        }

        return {
            name: endpointGroup.name,
            description: endpointGroup.description,
            endpoints: endpoints
        };
    });
}

function processRequest(requestSource, url) {
    if(requestSource.body && requestSource.body.raw) {
        try {
            requestSource.body = JSON.parse(requestSource.body.raw);
        }
        catch(err) {
            console.log('error parsing request body: ' + requestSource.body.raw);
        }
    }

    requestSource.headers = requestSource.header;
    requestSource.byLanguage = HTTPCallsGenerator(requestSource, url);

    return requestSource;
}

function processResponse(responseSource) {
    if(responseSource.length > 0) {
        return responseSource.map( (response) => {
            if(response.body) {
                let body;

                try {
                    body = JSON.parse(response.body);
                }
                catch(err) {
                    console.log('error parsing response body: ' + response.body);
                }

                return {
                    name: response.name,
                    body: body
                }
            }
        });
    }
}