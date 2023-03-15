<script>
    let submit_btn
    let excel_file
    let python_file

    function checkFiles(){
        if(python_file != undefined && excel_file != undefined){
            submit_btn.disabled = false
        }
    }
</script>

<form method="post" enctype="multipart/form-data" action="/file/upload" on:change={()=>checkFiles()} class="flex gap-4 justify-items-stretch mx-auto">
    <div class="form-control w-full max-w-xs">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">
            <span class="label-text">Python file</span>
        </label>
        <input type="file" class="file-input file-input-bordered w-full max-w-xs bg-primary" accept=".py" name="pythonFile" bind:files={python_file}/>
    </div>

    <div class="form-control w-full max-w-xs">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">
            <span class="label-text">Excel file</span>
        </label>
        <input type="file" class="file-input file-input-bordered w-full max-w-xs bg-success" accept=".xlsx" name="excelFile" bind:files={excel_file}/>
    </div>
    <div class="self-center pt-9">
        <button type="submit" class="btn btn-secondary " bind:this={submit_btn} disabled>Upload</button>
    </div>

</form>
