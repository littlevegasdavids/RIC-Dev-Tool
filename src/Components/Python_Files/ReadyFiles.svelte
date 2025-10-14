<script>
    import UploadFile from "../UploadFile.svelte";
    import TabBar from "../TabBar.svelte";
    import ReadyCard from "../FileCard/ReadyCard.svelte";
    import LoadingMessage from "../LoadingMessage.svelte";
    import { onMount } from "svelte";
    import {show_delete_scenario_popup} from '../../Stores/delete_scenario_popup' 
    import DeleteFilePopup from "../Popups/Delete_File_Popup.svelte";

    let ready_files = []
    let loading = true

    onMount(async ()=>{
        const res = await fetch('/file/ready', {method: 'POST'})
        const result = await res.json()

        if(result.success){
            ready_files = result.files
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
            colour = "bg-base-300"
        }
        cardColourCheck = !cardColourCheck
        return colour
    }
</script>

{#if !loading}
<div class="flex flex-col gap-4">
    {#if $show_delete_scenario_popup}
        <DeleteFilePopup />
    {/if}
    <UploadFile/>
    <TabBar />
    {#if ready_files.length != 0}
        <div class="card shadow-lg mt-5 bg-primary w-4/6 mx-auto">
            <div class="card-body">
                <p class="card-title text-black text-center text-3xl">Ready</p>
                {#each ready_files as file}
                    <ReadyCard fileId={file.id} filename={file.file_name} uploadedDateTime={file.upload_date} cardColour={getCardColour()}/>
                {/each}
            </div>
        </div>
    {:else}
        <p class="font-bold text-2xl text-center">Currently no ready files</p>
    {/if}
</div>
{:else}
    <LoadingMessage />
{/if}