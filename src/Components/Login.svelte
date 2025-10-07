<script>
    let showError = false
    let passwordField = ""
    async function login(){
        const res = await fetch('/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: passwordField
            })
        })
        const result = await res.json()
        if(result.success){
            window.location.href = "/"
        }
        else{
            showError = true
        }
    }

    document.onkeydown = function(e){
        e = e || window.event
        let key = e.key
        if(key === 'Enter'){
            login()
        }
    }

</script>
<div class="grid grid-cols-1 justify-items-center gap-2">
    <p>Enter Password</p>
    <input type="password" class="input input-bordered" bind:value={passwordField} />
    {#if showError}
        <p class="text-center font-bold text-red-500">Incorrect password</p>
    {/if}
    <button class="btn btn-primary" on:click={login}>Login</button>
    
</div>
