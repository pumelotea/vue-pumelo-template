const path = require('path')
const fs = require('fs')

const {
    sortDependencies,
    printMessage,
    initGit,
    installDependencies,
    autoRun
} = require('./utils')

module.exports = {
    prompts: {
        name: {
            type: 'string',
            required: true,
            message: 'Project name',
            default: "pumelo-hello-vue"
        },
        description: {
            type: 'string',
            required: false,
            message: 'Project description',
            default: 'a iview vue project ',
        },
        author: {
            type: 'string',
            message: 'Author',
            default: "you name"
        },
        version: {
            type: 'string',
            message: 'Project version',
            default: "0.0.1"
        },
        autoInitGit:{
            type: 'string',
            message: 'Auto init git repo',
            required: true,
            default: "yes"
        },
        autoInstall:{
            type: 'string',
            message: 'Auto install dependencies',
            required: true,
            default: "yes"
        },
        autoRun:{
            type: 'string',
            message: 'Auto run',
            required: true,
            default: "yes"
        }

    },
    complete: function(data, { chalk }) {
        const green = chalk.green
        const yellow = chalk.yellow
        const myc = chalk.hex('#0dfdd3')
        let cwd = './'+data.destDirName
        chalk['myc'] = myc
        printMessage(data, chalk)
        sortDependencies(data)
        if (data.autoRun === 'yes'){
            data.autoInstall = 'yes'
        }
        initGit(myc,cwd,data).then(()=>{
           return installDependencies(myc,cwd,data)
        }).then(()=>{
           return autoRun(myc,cwd,data)
        })

    },
}
