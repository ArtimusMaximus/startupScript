import open from 'open';
import readline from 'readline';
import fs from 'fs';
import dns from 'node:dns'
import os from 'node:os'
import { exec } from 'child_process'
import util from 'node:util'





console.log('Node has been running for: ' + os.uptime() / 60 + ' minutes')
console.log('Kernel: ' + os.version());
const RL = readline.createInterface({ input: process.stdin, output: process.stdout })

const html = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/dist/output.css" rel="stylesheet">
</head>
<body class="bg-blue-50">
<div class="container grid grid-cols-3 gap-4 items-center justify-center">
  <h1 class="text-3xl font-bold underline text-center bg-pink-100 col-start-2 col-end-3">
    Project
  </h1>
</div>
</body>
</html>` 

const inputCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
const ex = util.promisify(exec);

const dir = process.cwd().split('/')
dir.pop()
let dir2 = dir.join('/')
let dir3 = process.cwd()



function create() {
    
    RL.question('Specify project name >>>> ', async name => {
        console.log('Project with alias of: ' + name + '\n')
        
        try {
            console.time('Created in')
            await ex(`cd gogo_projects && npm create vite@latest ${name} -- --template vanilla && cd ${name} && code .`);
            console.timeEnd('Created in')
        } catch(err) {

            console.error(err);

        }

        setupTailwindCSS();
        makeIndexFile();
        makeCSSFile();
        removeExcess();
            
        
        function makeIndexFile () {
            fs.writeFile(`${dir3}/gogo_projects/${name}/index.html`, html, err => {
                if (err) console.log(err);
                else console.info('html file successfully rewritten')
            })
            fs.writeFile(`${dir3}/gogo_projects/${name}/main.js`, '// npx tailwindcss -i ./input.css -o ./dist/output.css --watch', err => {
                if (err) console.log(err);
                else console.info('main.js file successfully rewritten')
            })
        }
        function makeCSSFile () {
            fs.writeFile(`${dir3}/gogo_projects/${name}/style.css`, '', err => {
                if (err) console.log(err);
                else console.info('css file successfully created')
            })
            fs.writeFile(`${dir3}/gogo_projects/${name}/input.css`, inputCSS, err => {
                if (err) console.log(err);
                else console.info('Tailwind input css file successfully created')
            })
            fs.writeFile(`${dir3}/gogo_projects/${name}/tailwind.config.cjs`, tailwindConfig, err => {
                if (err) console.log(err);
                else console.info('Tailwind config file successfully created')
            })
        }
        async function setupTailwindCSS () {
            try {
                await ex(`cd gogo_projects/${name} && npm i -D tailwindcss && mkdir dist && npx tailwindcss -i ./input.css -o ./dist/output.css --watch`, (err, stdout, stderr) => {
                    console.log('Tailwind build watching...')
                    if (err) {
                        console.error(err); 
                        return
                    } else {
                        console.log('Tailwind setup complete');
                    }
                })
            } catch (err) {
                console.log(err);
            }
            
        }
        function removeExcess() {
            fs.unlinkSync(`/${dir3}/gogo_projects/${name}/javascript.svg`)
            fs.unlinkSync(`/${dir3}/gogo_projects/${name}/counter.js`)
            fs.unlinkSync(`/${dir3}/gogo_projects/${name}/public/vite.svg`)
            
        }

        RL.close()
    })
}
create()
