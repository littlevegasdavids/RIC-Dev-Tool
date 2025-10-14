<script>
    import TabBar from "../TabBar.svelte";
    import { onDestroy, onMount } from "svelte";
    import LoadingMessage from "../LoadingMessage.svelte";
    import QueueCard from "../FileCard/QueueCard.svelte";
    import BusyCard from "../FileCard/BusyCard.svelte";
    import {io} from 'socket.io-client'

    let queue_files = []
    let busy_file = [];
    let loading = true

    let socket = io()    
    onMount(async ()=>{
        socket.emit('getBusy')
        loading = false
    })

    let interval = setInterval(()=>{
        socket.emit('getBusy')
    }, 3000)

    socket.on('receiveBusy', (response)=>{
        queue_files = response.queue 
        busy_file = response.busy
        loading = false
    })

    onDestroy(()=>{
        clearInterval(interval)
        socket.disconnect()
    })

    let cardColourCheck = false
    function getCardColour(){
        let colour;

        if(!cardColourCheck){
            colour = "bg-base-300"
        }
        else{
            colour = "bg-base-300"
        }
        cardColourCheck = !cardColourCheck
        return colour
    }
</script>

{#if !loading}
    <div class="flex flex-col gap-4">
        <TabBar />
        {#if busy_file.length != 0}
            <div class="card shadow-lg mt-5 bg-success w-4/6 mx-auto">
                <div class="card-body">
                    <p class="card-title text-black text-center text-3xl">Busy</p>
                    {#each busy_file as file}
                        <BusyCard fileId={file.id} filename={file.file_name} />
                    {/each}
                </div>
            </div>
        {/if}
        {#if queue_files.length != 0}
            <div class="card shadow-lg mt-5 bg-neutral-content w-4/6 mx-auto">
                <div class="card-body">
                    <p class="card-title text-black text-center text-3xl">Queue</p>
                    {#each queue_files as file}
                        <QueueCard fileId={file.id} filename={file.file_name} uploadedDateTime={file.upload_date} cardColour={getCardColour()}/>
                    {/each}
                </div>
            </div>
        {/if}
        {#if queue_files.length == 0 && busy_file.length == 0}
            <p class="font-bold text-2xl text-center">Currently no Queued / Busy files</p>
        {/if}
    </div>
{:else}
    <LoadingMessage />
{/if}
