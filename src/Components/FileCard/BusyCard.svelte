<script>
    import {io} from 'socket.io-client'
    import { onMount, onDestroy } from 'svelte';
    export let fileId
    export let filename

    let solverFeedback = ""
    let solverTextArea
    let socket = io()

    function downloadInputFile(){
        window.location.href = `/file/downloadPythonFile/${fileId}`
    }

    function downloadExcelFile(){
        window.location.href = `/file/downloadExcelInputFile/${fileId}`
    }

    async function killSolver(){
        const res = await fetch(`/solver/killSolver/${fileId}`, {method: "DELETE"})
        const result = await res.json()

        if(!result.success){
            alert(`Error killing python file #${fileId}`)
        }
    }

    onMount(()=>{
        socket.on('solverFeedback', (data)=>{
            solverFeedback += data
            solverTextArea.scrollTop = solverTextArea.scrollHeight
        })
    })

    onDestroy(()=>{
        socket.disconnect()
    })
</script>

<div class="card shadow-lg p-5 mt-4 mb-1 bg-base-300">
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
                <button class="btn btn-sm btn-circle btn-success btn-outline" on:click={()=>downloadExcelFile()}><i class="fas fa-file-excel"></i></button>
            </div>
            <div class="tooltip tooltip-bottom font-bold" data-tip="Kill solver">
                <button class="btn btn-sm btn-error btn-outline btn-circle" on:click={()=>killSolver()}><i class="fas fa-skull"></i></button>
            </div>
        </div>
    </div>
    
    <div class="grid grid-cols-1 justify-items-center">
        <h1 class="text-xl font-bold mt-5">Solver Feedback</h1>
        <textarea class="text-white mt-2 pl-3" value={solverFeedback} bind:this={solverTextArea} disabled></textarea>
    </div>
</div>

<style>
    textarea{
        width: 75%;
        height: 150px;
    }
</style>
