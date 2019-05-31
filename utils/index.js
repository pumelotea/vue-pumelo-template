const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

const lintStyles = ['standard', 'airbnb']

/**
 * Sorts dependencies in package.json alphabetically.
 * They are unsorted because they were grouped for the handlebars helpers
 * @param {object} data Data from questionnaire
 */
exports.sortDependencies = function sortDependencies(data) {
    const packageJsonFile = path.join(
        data.inPlace ? '' : data.destDirName,
        'package.json'
    )
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile))
    packageJson.devDependencies = sortObject(packageJson.devDependencies)
    packageJson.dependencies = sortObject(packageJson.dependencies)
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + '\n')
}

/**
 * Runs `yarn install` in the project directory
 * @param {string} cwd Path of the created project directory
 * @param {object} data Data from questionnaire
 */
exports.installDependencies = function installDependencies(color, cwd,data) {
    if (data.autoInstall !=='yes'){
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    console.log(`\n\n=>${color('installing project dependencies ...')}`)
    return runCommand('yarn', ['install'], {
        cwd,
    })
}


exports.initGit = function initGit(color, cwd,data) {
    if (data.autoInitGit !=='yes'){
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    console.log(`\n\n=>${color('init git repo ...')}`)
    return runCommand('git', ['init'], {
        cwd,
    })

}

exports.autoRun = function autoRun(color, cwd,data) {
    if (data.autoRun !=='yes'){
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    console.log(`\n\n=>${color('starting run ...')}`)
    return runCommand('yarn', ['serve'], {
        cwd,
    })
}

/**
 * Prints the final message with instructions of necessary next steps.
 * @param {Object} data Data from questionnaire.
 */
exports.printMessage = function printMessage(data, {green, yellow,myc}) {
    const message = `
  ${myc(' _____   _   _       ___  ___   _____   _       _____')}
  ${myc('|  _  \\\\| | | |     /   |/   | | ____| | |     /  _  \\\\')}
  ${myc('| |_| | | | | |    / /|   /| | | |__   | |     | | | |')}
  ${myc('|  ___/ | | | |   / / |__/ | | |  __|  | |     | | | |')}
  ${myc('| |     | |_| |  / /       | | | |___  | |___  | |_| |')}
  ${myc('|_|     \\\\_____//_/        |_| |_____| |_____| \\\\____/')}
  ${yellow('vue-cli-iview-template version: ')}${green('1.0.0')}
  ${yellow('https://github.com/pumelotea/vue-cli-iview-template')}
  

  To get started（Manually）:

  ${yellow(
        `${data.inPlace ? '' : `cd ${data.destDirName}\n  `}${installMsg(
            data
        )}  yarn serve`
    )}
  
`
    console.log(message)
}


/**
 * If the user will have to run `npm install` or `yarn` themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from the questionnaire
 */
function installMsg(data) {
    return 'yarn install\n'
}

/**
 * Spawns a child process and runs the specified command
 * By default, runs in the CWD and inherits stdio
 * Options are the same as node's child_process.spawn
 * @param {string} cmd
 * @param {array<string>} args
 * @param {object} options
 */
function runCommand(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const spwan = spawn(
            cmd,
            args,
            Object.assign(
                {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true,
                },
                options
            )
        )

        spwan.on('exit', () => {
            resolve()
        })
    })
}

function sortObject(object) {
    // Based on https://github.com/yarnpkg/yarn/blob/v1.3.2/src/config.js#L79-L85
    const sortedObject = {}
    Object.keys(object)
        .sort()
        .forEach(item => {
            sortedObject[item] = object[item]
        })
    return sortedObject
}
