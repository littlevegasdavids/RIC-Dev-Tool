<script>
    import {show_delete_scenario_popup} from '../../Stores/delete_scenario_popup'
    export let fileId
    export let filename
    export let uploadedDateTime
    export let cardColour
    export let errorMessage

    async function deleteFile(){
        if(confirm(`Are you sure you want to delete file #${fileId}`)){
            $show_delete_scenario_popup = true
            const res = await fetch(`/file/${fileId}`, {method: "DELETE"})
            const result = await res.json()
            
            if(result.success){
                window.location.reload()
            }
            else{
                alert(`Error deleting file #${fileId}`)
            }
        }
    }

    function downloadInputFile(){
        window.location.href = `/file/downloadPythonFile/${fileId}`
    }

    function downloadOutputFile(){
        window.location.href = `/file/downloadOutputTextFile/${fileId}`
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
            <div class="tooltip tooltip-bottom font-bold mr-3" data-tip="Download input python file">
                <button class="btn btn-sm btn-circle btn-warning btn-outline" on:click={()=>downloadInputFile()}><i class="fas fa-code"></i></button>
            </div>
            <div class="tooltip tooltip-bottom font-bold mr-3" data-tip="Download input excel file">
                <button class="btn btn-sm btn-circle btn-success btn-outline" on:click={()=>downloadExcelFile()}><i class="fas fa-file-excel"></i><button>
            </div>
            <div class="tooltip tooltip-bottom font-bold mr-3" data-tip="Download output log file">
                <button class="btn btn-sm btn-circle btn-primary btn-outline" on:click={()=>downloadOutputFile()}><i class="fas fa-file-download"></i></button>
            </div>
            <div class="tooltip tooltip-bottom font-bold" data-tip="Delete file">
                <button class="btn btn-sm btn-error btn-outline btn-circle" on:click={()=>deleteFile()}><i class="fas fa-trash"></i></button>
            </div>
        </div>
    </div>
    
    <div class="grid mt-2">
        <span class="text-sm">
            Upload Date & Time: {dateFormat()}
        </span>
    </div>
    <div class="card border rounded-box bg-base-100 mt-5 p-3">
        <h1 class="font-bold text-l pl-1">
            Error message
        </h1>
        <p class="p-1">
            {errorMessage}
        </p>
    </div>

</div>

