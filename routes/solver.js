const {Router} = require('express')
const router = new Router()
const prisma = require('../prisma/client')
module.exports = router

const logger = require('../helpers/logger')

const filesystem = require('fs')

let io = global.io

const pySpawn = require('child_process').spawn;
var py

router.delete('/killSolver/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).json({success: false, message: "Invalid ID"})
    }

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).json({success: false, message: `Cannot find file with id: ${file_id}`})
    }

    if(file_record.status != 2){
        return res.status(400).json({success: false, message: `File is not busy`})
    }

    py.kill('SIGINT')

    return res.status(200).json({success: true})
})

async function solvePythonFile(file_id, callback){
    try{
        let errorEncountered = false
        let errorMessage = ""

        // Set solver to busy
        await prisma.solver_Busy.update({
            where:{
                id: 1
            }, 
            data:{
                is_busy: true
            }
        })
        // Set file status to busy
        await prisma.python_Files.update({
            where:{
                id: file_id
            },
            data:{
                status: 2
            }
        })

        let writeStream = filesystem.createWriteStream(`files/${file_id}/output.txt`)

        py = pySpawn('python3', ["-u", `files/${file_id}/input.py`, `${file_id}`])
        logger.info(`Solver API -- Solver start run on file id: ${file_id}`)

        py.stdout.on('data', (data)=>{
            let solverData = String(data)
            writeStream.write(solverData)
            io.sockets.emit('solverFeedback', solverData)
        })

        py.stderr.on('data', async (data)=>{
            errorEncountered = true
            errorMessage = String(data)
        })

        py.on('exit', async function(code){
            if(errorEncountered){
                if(errorMessage.includes("KeyboardInterrupt")){
                    writeStream.write("Killed by user")
                    await prisma.python_Files.update({
                        where:{
                            id: file_id
                        }, 
                        data:{
                            status: 4, 
                            error_message: "Killed by user"
                        }
                    })
                    logger.info(`Solver API -- Killed solver file id: ${file_id}`)
                }
                else{
                    writeStream.write(errorMessage)
                    await prisma.python_Files.update({
                        where:{
                            id: file_id
                        }, 
                        data:{
                            status: 4, 
                            error_message: errorMessage
                        }
                    })
                    logger.error(`Solver API -- Error encountered with solver file id ${file_id}: ${errorMessage}`)
                }
            }
            else{
                
                await prisma.$queryRaw`UPDATE public."Python_Files" SET status = 3, solved_date = now() WHERE id = ${file_id}`

                logger.info(`Solver API -- Successful run file id: #${file_id}`)
            }
            writeStream.end()
            callback()
        })
    }
    catch(err){
        logger.error(`Solver API -- Error in solvePythonFile function: ${err}`)
    }
}

setInterval(async function(){
    const solver_busy = await prisma.solver_Busy.findUnique({
        where:{
            id: 1
        }
    })

    const scenario_queue = await prisma.scenarios.findMany({
        where:{
            OR:[
                {scenario_status: 1},
                {scenario_status: 2},
                {scenario_status: 3},
                {scenario_status: 6},
            ]
        }
    })

    if(!solver_busy.is_busy && scenario_queue.length == 0){
        const files = await prisma.python_Files.findMany({
            where:{
                status: 1
            }, 
            orderBy:{
                id: 'desc'
            }
        })

        if(files.length != 0){
            const file_id = files[0].id
            solvePythonFile(file_id, async function(){
                // Allow the busy card to disappear 
                setTimeout(()=>{}, 5000)

                await prisma.solver_Busy.update({
                    where:{
                        id: 1
                    }, 
                    data:{
                        is_busy: false
                    }
                })
            })
        }
    }

}, 5000)
