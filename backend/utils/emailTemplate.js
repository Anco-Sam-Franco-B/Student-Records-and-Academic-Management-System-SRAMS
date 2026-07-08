import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";


export async function loadEmailTemplate(
    template,
    data
){

const layout = await fs.readFile(
    path.join(
        process.cwd(),
        "templates/layout.html"
    ),
    "utf-8"
);


const body = await fs.readFile(
    path.join(
        process.cwd(),
        `templates/${template}.html`
    ),
    "utf-8"
);



const compiledLayout =
    Handlebars.compile(layout);


const compiledBody =
    Handlebars.compile(body);



return compiledLayout({

    ...data,

    body: compiledBody(data),

    year:
    new Date().getFullYear()

});


}