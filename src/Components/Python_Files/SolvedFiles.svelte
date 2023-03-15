<script>
    import { onMount } from "svelte";
    import SolvedCard from "../FileCard/SolvedCard.svelte";
    import LoadingMessage from "../LoadingMessage.svelte";
    import TabBar from "../TabBar.svelte";

    let solved_files = []
    let loading = true

    onMount(async ()=>{
        const res = await fetch('/file/solved', {method: 'POST'})
        const result = await res.json()

        if(result.success){
            solved_files = result.files
            loading = false
        }
    })

    //Alternating card colours
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
        {#if solved_files.length != 0}
            <div class="card shadow-lg mt-5 bg-secondary w-4/6 mx-auto">
                <div class="card-body">
                    <p class="card-title text-black text-center text-3xl">Solved</p>
                    {#each solved_files as file}
                        <SolvedCard fileId={file.id} filename={file.file_name} uploadedDateTime={file.upload_date} cardColour={getCardColour()} solvedDateTime={file.solved_date}/>
                    {/each}
                </div>
            </div>
        {:else}
            <p class="font-bold text-2xl text-center">Currently no solved files</p>
        {/if}
    </div>
{:else}
    <LoadingMessage />
{/if}