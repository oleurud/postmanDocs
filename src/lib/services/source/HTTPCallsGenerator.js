import HTTPSnippet from 'httpsnippet';

export default function(request, url) {
    let HARFormatCall = createHARFormatCall(request, url);

    let snippet = new HTTPSnippet(HARFormatCall);

/*
    console.log("NODE ", snippet.convert('node'));
    console.log("PHP ", snippet.convert('php'));
    console.log("JAVA ", snippet.convert('java'));
    console.log("JAVASCRIPT ", snippet.convert('javascript'));
    console.log("CURL ", snippet.convert('shell'));
    console.log("OBJECTIVEC ", snippet.convert('objc'));
    console.log("SWIFT ", snippet.convert('swift'));
*/

    return {
        curl: snippet.convert('shell'),
        node: snippet.convert('node'),
        javascript: snippet.convert('javascript'),
        php: snippet.convert('php'),
        python: snippet.convert('python'),
        java: snippet.convert('java'),
        objc: snippet.convert('objc'),
        swift: snippet.convert('swift'),
        ruby: snippet.convert('ruby')
    }
}

function createHARFormatCall(request, url) {
    let HARFormatCall = {
        method: request.method,
        url: url,
        httpVersion: "HTTP/1.1"
    };

    if(request.headers) {
        HARFormatCall.headers = request.headers.map( (header) => {
            return {
                "name": header.key,
                "value": header.value
            }
        });
    }

    /*
     TODO: FIND cookie in postmant export file
     HARFormatCall.cookies =  [
     {
     "name": "foo",
     "value": "bar"
     },
     {
     "name": "bar",
     "value": "baz"
     }
     ];
     */

    if(request.body) {
        HARFormatCall.postData = {
            mimeType: "application/json",
            text: JSON.stringify(request.body)
        };
    }
    
    return HARFormatCall;
}