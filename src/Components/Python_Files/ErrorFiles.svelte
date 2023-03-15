<script>
    import { onMount } from "svelte";
    import ErrorCard from "../FileCard/ErrorCard.svelte";
    import LoadingMessage from "../LoadingMessage.svelte";
    import TabBar from "../TabBar.svelte";

    let error_files = []
    let loading = true

    onMount(async ()=>{
        const res = await fetch('/file/error', {method: "POST"})
        const result = await res.json()

        if(result.success){
            error_files = result.files
            loading = false
        }
    })

    let cardColourCheck = false
    function getCardColour(){
        let colour;

        if(!cardColourCheck){
            colour = "bg-base-300"
        }
        else{
            colour = "bg-base-100"
        }
        cardColourCheck = !cardColourCheck
        return colour
    }
</script>

{#if !loading}
<div class="flex flex-col gap-4">
    <TabBar />
    {#if error_files.length != 0}
        <div class="card shadow-lg mt-5 bg-error w-4/6 mx-auto">
            <div class="card-body">
                <p class="card-title text-black text-center text-3xl">Error</p>
                {#each error_files as file}
                    <ErrorCard fileId={file.id} filename={file.file_name} uploadedDateTime={file.upload_date} cardColour={getCardColour()} errorMessage={file.error_message}/>
                {/each}
            </div>
        </div>
    {:else}
        <p class="font-bold text-2xl text-center">Currently no error files</p>
    {/if}
</div>
{:else}
    <LoadingMessage />
{/if}