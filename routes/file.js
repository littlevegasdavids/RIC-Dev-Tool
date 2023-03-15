const {Router} = require('express')
const router = new Router()
module.exports = router

const logger = require('../helpers/logger')

const filesystem = require('fs')

const prisma = require('../prisma/client')

const multer = require('multer')

const python_excel_storage = multer.diskStorage({
    destination: async function(req, file, cb){
        if(file.fieldname == "pythonFile"){
            await prisma.python_Files.update({
                where:{
                    id: req.new_file_id
                }, 
                data:{
                    file_name: file.originalname,
                }
            })
        }
        
        cb(null, req.new_directory)
    },
    filename: async function(req, file, cb){
        if(file.fieldname == "pythonFile"){
            cb(null, "input.py")
        }
        else if(file.fieldname == "excelFile"){
            cb(null, "input.xlsx")
        }

    }
})

const python_excel_upload = multer({storage: python_excel_storage})

async function createNewFileID(req, res, next){
    const new_file_id = await prisma.python_Files.create({
        data:{
            status: 0
        }
    })
    req.new_file_id = new_file_id.id
    next()
}

function createFileDirectory(req, res, next){
    const new_directory = `./files/${req.new_file_id}`
    filesystem.mkdirSync(new_directory)
    req.new_directory = new_directory
    next()
}

router.post('/upload', createNewFileID, createFileDirectory, python_excel_upload.fields([{name: "pythonFile", maxCount: 1}, {name: "excelFile", maxCount: 1}]),async function(req, res){
    logger.info(`File API -- Create new file entry id: ${req.new_file_id}`)
    return res.redirect('/')
})


router.delete('/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).json({success: false, message: "Invalid ID"})
    }   

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record === null){
        return res.status(404).json({success: false, message: `File does not exist with id ${file_id}`})
    }

    await prisma.python_Files.delete({
        where:{
            id: file_id
        }
    })

    filesystem.rm(`${process.cwd()}/files/${file_id}`, {recursive: true}, function(err){
        if(err){
            logger.error(`File API -- Error deleting file directory: ${err}`)
        }
    })

    logger.info(`File API -- Deleted file entry id: ${file_id}`)
    return res.status(200).json({success: true})
})

router.get('/downloadPythonFile/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).send('Invalid file id')
    }

    const file_path = `${process.cwd()}/files/${file_id}/input.py`

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).send('Cannot find python file in database')
    }

    res.download(file_path, file_record.file_name, function(err){
        if(err){
            logger.error(`File API -- Download Python File: ${err}`)
            return res.status(404).send('Cannot find python file in server directory')
        }
    })
})

router.get('/downloadOutputTextFile/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).send('Invalid file id')
    }

    const file_path = `${process.cwd()}/files/${file_id}/output.txt`

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).send('Cannot find python file in database')
    }

    res.download(file_path, `${file_id} - output.txt`, function(err){
        if(err){
            logger.error(`File API -- Error downloading output log file: ${err}`)
            return res.status(404).send('Cannot find output text file in server directory')
        }
    })
})

router.get('/downloadExcelInputFile/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).send('Invalid file id')
    }

    const file_path = `${process.cwd()}/files/${file_id}/input.xlsx`

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).send('Cannot find python file in database')
    }

    res.download(file_path, `${file_id} - input.xlsx`, function(err){
        if(err){
            logger.error(`File API -- Error downloading input excel file: ${err}`)
            return res.status(404).send('Cannot find input excel file in server directory')
        }
    })
})

router.get('/downloadOutputExcelFile/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status.send('Invalid file id')
    }

    const file_path = `${process.cwd()}/files/${file_id}/output.xlsx`

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).send('Cannot find python file in database')
    }

    return res.download(file_path, `${file_id} - output.xlsx`, function(err){
        if(err){
            logger.error(`File API -- Error downloading output excel file: ${err}`)
            return res.status(404).send('Cannot find output excel file in server directory')
        }
    })
})

router.post('/ready', async function(req, res){
    const files = await prisma.python_Files.findMany({
        where:{
            status: 0,
        },
        orderBy:{
            id: 'desc'
        }
    })

    return res.status(200).json({success: true, files: files})
})

router.post('/busy', async function(req, res){
    const file = await prisma.python_Files.findMany({
        where:{
            status: 2
        }
    })
    return res.status(200).json({success: true, file: file})
})
    
router.post('/solved', async function(req, res){
    const files = await prisma.python_Files.findMany({
        where:{
            status: 3
        }, 
        orderBy:{
            id: 'desc'
        }
    })

    return res.status(200).json({success: true, files: files}) 
})

router.post('/error', async function(req, res){
    const files = await prisma.python_Files.findMany({
        where:{
            status: 4
        }, 
        orderBy:{
            id: 'desc'
        }
    })

    return res.status(200).json({success: true, files: files}) 
})

router.post('/sendToQueue/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).json({success: false, message: "Invalid ID format"})
    }

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).json({success: false, message: "Cannot find file in database"})
    }

    if(file_record.status != 0){
        return res.status(400).json({success: false, message: "Cannot send non-ready file to queue"})
    }

    await prisma.python_Files.update({
        where:{
            id: file_id
        }, 
        data:{
            status: 1
        }
    })

    logger.info(`File API -- Sent to queue file id: ${file_id}`)

    return res.status(200).json({success: true})
})

router.post('/dequeue/:id', async function(req, res){
    const file_id = parseInt(req.params['id'])

    if(isNaN(file_id)){
        return res.status(400).json({success: false, message: "Invalid ID format"})
    }

    const file_record = await prisma.python_Files.findUnique({
        where:{
            id: file_id
        }
    })

    if(file_record == null){
        return res.status(404).json({success: false, message: "Cannot find file in database"})
    }

    if(file_record.status != 1){
        return res.status(400).json({success: false, message: "Cannot dequeue file that is not in queue"})
    }

    await prisma.python_Files.update({
        where:{
            id: file_id
        }, 
        data:{
            status: 0
        }
    })      

    logger.info(`File API -- Dequeue file id: ${file_id}`)

    return res.status(200).json({success: true})
})