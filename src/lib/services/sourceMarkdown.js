import { Source } from '~/src/lib/models';

export default function(sourceName) {
    return Source.findOne({name: sourceName}).then(
        (source) => {
            let sourceMarkdown = "";

            sourceMarkdown += source.description + "\n";

            sourceMarkdown += "# Calls list \n";

            source.data.forEach( (endpointsGroup) => {

                sourceMarkdown += "## " + endpointsGroup.name + "\n";
                sourceMarkdown += endpointsGroup.description + "\n";

                endpointsGroup.endpoints.forEach( (endpoint) => {
                    sourceMarkdown += "### " + endpoint.name + "\n";

                    if(endpoint.description) {
                        sourceMarkdown += endpoint.description + "\n";
                    } else if(endpoint.request.description) {
                        sourceMarkdown += endpoint.request.description + "\n";
                    }

                    sourceMarkdown += "```endpoint" + "\n";
                    sourceMarkdown += endpoint.request.method + " " + endpoint.request.url + "\n";
                    sourceMarkdown += "```" + "\n";

                    sourceMarkdown += "#### Request example" + "\n";
                    for(let i in endpoint.request.byLanguage) {
                        sourceMarkdown += "```" + i + "\n";
                        sourceMarkdown += endpoint.request.byLanguage[i] + "\n";q
                        sourceMarkdown += "```" + "\n";
                    }

                    if(endpoint.response.length > 0) {
                        sourceMarkdown += "#### Response examples \n";

                        endpoint.response.forEach( (response) => {
                            sourceMarkdown += "##### " + response.name + " \n";

                            sourceMarkdown += "```json" + "\n";
                            sourceMarkdown += JSON.stringify(response.body) + "\n";
                            sourceMarkdown += "```" + "\n";
                        })
                    }


                });
            });


            return sourceMarkdown;
        }
    );
}