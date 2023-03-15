<script>
    export let fileId
    export let filename
    export let uploadedDateTime
    export let cardColour

    async function dequeueFile(){
        const res = await fetch(`/file/dequeue/${fileId}`, {method: "POST"})
        const result = await res.json()
        
        if(result.success){
            window.location.reload()
        }
        else{
            alert(`Error dequeue file #${fileId}`)
        }
    }

    function downloadInputFile(){
        window.location.href = `/file/downloadPythonFile/${fileId}`
    }
    
    function downloadExcelFile(){
        window.location.href = `/file/downloadExcelInputFile/${fileId}`
    }

    function dateFormat(){
        let date = new Date(uploadedDateTime)

        return `${date.getFullYear()}-${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth()+1}`}-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} (UTC+2)`
    }
</script>

<div class="card shadow-lg p-5 mt-4 mb-1 {cardColour}">
    <div class="grid grid-cols-2 justify-items-stretch">
        <div class="justify-self-start">
            <h1 class="text-xl font-bold">
                #{fileId} - {filename}
            </h1>
        </div>
        <div class="justify-self-end">
            <div class="tooltip tooltip-bottom font-bold" data-tip="Download input python file">
                <button class="btn btn-sm btn-circle btn-warning btn-outline" on:click={()=>downloadInputFile()}><i class="fas fa-code"></i></button>
            </div>
            <div class="tooltip tooltip-bottom font-bold ml-3" data-tip="Download input excel file">
                <button class="btn btn-sm btn-circle btn-success btn-outline" on:click={()=>downloadExcelFile()}><i class="fas fa-file-excel"></i></button>
            </div>
            <div class="tooltip tooltip-bottom font-bold ml-3" data-tip="Dequeue">
                <button class="btn btn-sm btn-error btn-circle btn-outline" on:click={()=>dequeueFile()}><i class="fas fa-minus"></i></button>
            </div>
        </div>
    </div>
    
    <div class="grid mt-2">

        <span class="text-sm">
            Upload Date & Time: {dateFormat()}
        </span>
    </div>

</div>

