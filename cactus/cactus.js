/*
@author Kristian Andersen Hole
*/

/*
Cactus templates
    Selectors:
        [data] is "for each" for arrays
        {{data}} is a single object
    Properties:
        {prop} prop is the name of the property of the object we're accessing through the selector.
    Pre-compiled (in a way) for effiency:
        Cactus statements must be on a single line, and the line can't start with whitespace.
*/

const Cactus = {

    render: function(template, data, selector) {

        selector.innerHTML = ""; //empty original content from selector, template-engine owns this area
        const lines = template.split("\n");

        const regex = /({.*?})/g;
        var newHTML = "";

        lines.forEach(l => {

            const statement = parseStatement(l, data);
            if (statement.valid) {

                l = "";

                const tokens = statement.restHTML.match(regex).map(m => {
                    return {replace: m, subkey: m.substring(1, m.length-1)};
                });

                statement.obj.forEach(d => {
                    
                    var output = (" " + statement.restHTML).slice(1);
                    tokens.forEach(t => {
                        output = output.replace(t.replace, d[t.subkey]);
                    });
                    
                    l += output;
                });
            }
            newHTML += l;
        });

        selector.innerHTML = newHTML;
    }
}

function drillDown(data, keyPath) {
    /* Figure out nested objects */
    var obj = data;
    const keys = keyPath.split(".");
    keys.forEach(k => {
        obj = obj[k];
    });
    return obj;
}

function parseStatement(l, data) {

    var r = {valid: false};

    if(l[0] === "[") {
        const split = l.split("]");
        const keyPath = split[0].substring(1);
        r = {keyPath: keyPath, restHTML: split[1], obj: drillDown(data, keyPath), valid: true};
    } else if (l[0]+l[1] === "{{") {
        const split = l.split("}}");
        const keyPath = split[0].substring(2);
        r = {keyPath: keyPath, restHTML: split[1], obj: [drillDown(data, keyPath)], valid: true};    
    }

    return r;
}