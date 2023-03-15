const prisma = require("../prisma/client");

module.exports = (io)=>{
    io.on('connect', socket =>{
        socket.on('getBusy', async function(){
            let queue = await prisma.python_Files.findMany({
                where:{
                    status: 1
                }, 
                orderBy:{
                    id: 'desc'
                }
            })

            let busy = await prisma.python_Files.findMany({
                where:{
                    status: 2
                }
            })

            socket.emit('receiveBusy', {
                queue: queue, 
                busy: busy
            })
        })
    })
}