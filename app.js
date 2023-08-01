
import readline from 'readline';
import fs from 'fs';
import os from 'node:os';
import { exec } from 'child_process';
import util from 'node:util';





console.log('Node has been running for: ' + os.uptime() / 60 + ' minutes');
console.log('Kernel: ' + os.version());
const RL = readline.createInterface({ input: process.stdin, output: process.stdout });

const metaTags = `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="" />
    <meta name="title" content="" />
    <meta name="author" content="AMIV" />
    <meta name="language" content="english" />
    <meta name="robots" content="index/follow" />
    <meta name="revised" content="" />
    <meta name="rating" content="safe for kids" />
    <meta name="HandheldFriendly" content="true" />
    <meta property="og:title" content="" />
    <meta property="og:url" content="" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="" />
    <meta property="og:image:secure_url" content="" />
    <meta property="og:image:type" content="image/jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="" />
    <meta property="og:type" content="website" />`;
const colors = `<div class="col-start-2 col-end-3 flex flex-col items-center justify-center">
        <div class="bg-primary p-5">bg-primary</div>
        <div class="bg-primary-focus p-5">bg-primary-focus</div>
        <div class="bg-primary-content p-5">bg-primary-content</div>
        <div class="bg-secondary p-5">bg-secondary</div>
        <div class="bg-secondary-focus p-5">bg-secondary-focus</div>
        <div class="bg-secondary-content p-5">bg-secondary-content</div>
        <div class="bg-accent p-5">bg-accent</div>
        <div class="bg-accent-focus p-5">bg-accent-focus</div>
        <div class="bg-accent-content p-5">bg-accent-content</div>
        <div class="bg-neutral p-5">bg-neutral</div>
        <div class="bg-neutral-focus p-5">bg-neutral-focus</div>
        <div class="bg-neutral-content p-5">bg-neutral-content</div>
        <div class="bg-base-100 p-5">base-100</div>
        <div class="bg-base-200 p-5">base-200</div>
        <div class="bg-base-300 p-5">base-300</div>
        <div class="bg-base-content p-5">base-content</div>
        <div class="bg-info p-5">bg-info</div>
        <div class="bg-info-content p-5">bg-info-content</div>
        <div class="bg-success p-5">bg-success</div>
        <div class="bg-success-content p-5">bg-success-content</div>
        <div class="bg-warning p-5">warning</div>
        <div class="bg-warning-content p-5">warning-content</div>
        <div class="bg-error p-5">error</div>
        <div class="bg-error-content p-5">error-content</div>
    </div>`;
const colorRefFile = `
    let colors = \`${colors}\`
    document.querySelector('#colorReference')
    .innerHTML = colors;

    (function openColorRef() {
    document.querySelector('#openColorRef')
        .addEventListener('click', e => {
            document.querySelector('#colorReference')
                .showModal();
        })
    })();
    (function closeColorRef() {
    window.addEventListener('click', e => {
        if (e.target.id !== 'openColorRef') document.querySelector('#colorReference').close();
    })
    })();
`

const html = `<!DOCTYPE html>
<html data-theme="business" lang="eng">
<head>
  ${metaTags}
  <link href="/dist/output.css" rel="stylesheet">
</head>
    <body class="h-screen">
        <nav class="w-full h-36 grid border border-primary">
            <ul class="grid grid-cols-5 text-center">
                <li class="col-start-2 col-end-3 flex justify-center items-center">About</li>
                <li class="col-start-3 col-end-4 flex justify-center items-center">Info</li>
                <li class="col-start-4 col-end-5 flex justify-center items-center">Contact</li>
            </ul>
        </nav>
        <main class="w-screen sm:w-3/4 mx-auto grid grid-cols-3 gap-4 h-full border border-secondary">
            <div class="col-start-2 col-end-3 flex flex-col items-center justify-center">
                <h1 class="text-3xl text-white font-bold underline col-start-2 col-end-3 p-24">
                    New Project
                </h1>
            </div>
        </main>
        <footer class="w-full h-36 grid border border-primary">
            <ul class="grid grid-cols-5 text-center">
                <li class="col-start-2 col-end-3 flex justify-center items-center">About</li>
                <li class="col-start-3 col-end-4 flex justify-center items-center">Info</li>
                <li class="col-start-4 col-end-5 flex justify-center items-center">Contact</li>
            </ul>
        </footer>
        <div id="openColorRef" class="fixed text-2xl text-white top-10 right-10 z-50">Color Ref</div>
        <dialog id="colorReference"></dialog>
        <script src="./colorReference.js" type="module"></script>
    </body>
</html>`;

const inputCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["wireframe", "business", "light", "dark"]
  }
}
`
const ex = util.promisify(exec);
const writeFile = util.promisify(fs.writeFile);

const dir = process.cwd().split('/');
dir.pop();
let homeDir = dir.pop();
let dir2 = dir.join('/');
let dir3 = process.cwd();
console.log('dir3: ', dir3);
console.log('dir2: ', dir2);
console.log('homeDir: ', homeDir);


async function create() {
        try {
            const name = await new Promise((resolve) => {
                RL.question('Specify project name >>>> ', answer => {
                    resolve(answer);
                })
            });   
            console.log('Project with alias of: ' + name + '\n');
            console.time('Created in');
            await ex(`cd && cd gogo_projects && npm create vite@latest ${name} -- --template vanilla && cd ${name} && code .`);
            console.timeEnd('Created in');
            
            await setupTailwindCSS(name);
            await installDaisyUI(name);
            await makeIndexFile(name);
            await writeColorRefFile(name);
            await makeCSSFile(name);
            await removeExcess(name);
            RL.close();
        } catch(err) {
            console.error(err);
            RL.close();
        }
}
create();

async function makeIndexFile (name) {
    try {
        await writeFile(`${dir2}/gogo_projects/${name}/index.html`, html)
            console.info('html file successfully rewritten');
        await writeFile(`${dir2}/gogo_projects/${name}/main.js`, '// npx tailwindcss -i ./input.css -o ./dist/output.css --watch');
            console.info('main.js file successfully rewritten');
    } catch(err) {
        console.error(err);
    }
    
}
async function makeCSSFile (name) {
    try {
        await writeFile(`${dir2}/gogo_projects/${name}/style.css`, '')
            console.info('css file successfully created');
        await writeFile(`${dir2}/gogo_projects/${name}/input.css`, inputCSS)
            console.info('Tailwind input css file successfully created');
        await writeFile(`${dir2}/gogo_projects/${name}/tailwind.config.cjs`, tailwindConfig)
            console.info('Tailwind config file successfully created')
    } catch(err) {
        console.error(err);
    }
}
async function setupTailwindCSS (name) {
    try {
        // await ex(`cd && cd gogo_projects/${name} && npm i -D tailwindcss && mkdir dist && npx tailwindcss -i ./input.css -o ./dist/output.css --watch`, (err, stdout, stderr) => {
        //     console.log('Tailwind build watching...')
        //     if (err) {
        //         console.error(err); 
        //         return
        //     } else {
        //         console.log('Tailwind setup complete');
        //     }
        // })
        // await ex(`cd && cd gogo_projects/${name} && npm i -D tailwindcss && mkdir dist && npx tailwindcss -i ./input.css -o ./dist/output.css --watch`)
        await ex(`cd && cd gogo_projects/${name} && npm i -D tailwindcss && mkdir dist`)
            console.info('Tailwind setup complete');
    } catch (err) {
        console.log(err);
    }
}
async function removeExcess(name) {
    fs.unlinkSync(`${dir2}/gogo_projects/${name}/javascript.svg`)
    fs.unlinkSync(`${dir2}/gogo_projects/${name}/counter.js`)
    fs.unlinkSync(`${dir2}/gogo_projects/${name}/public/vite.svg`)
    
}
async function installDaisyUI(name) {
    try {
        await ex(`cd && cd gogo_projects/${name} && npm i -D daisyui`);
        console.info('Daisy UI installed');
    } catch(err) { 
        console.error(err);
    }
}
async function writeColorRefFile(name) {
    try {
        await writeFile(`${dir2}/gogo_projects/${name}/colorReference.js`, colorRefFile)
            console.info('color reference file successfully written');
    } catch(err) {
        console.error(err);
    }
}
