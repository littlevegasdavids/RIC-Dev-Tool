<script>
    async function logout(){
        await fetch('/logout', {method: "POST"})
        window.location.href = "/login"
    }
</script>

<div class="navbar mb-2 shadow-lg bg-neutral-content rounded-box w-3/4 mx-auto">
    <div class="px-2 mx-2 navbar-start">
        <p class="font-bold text-xs"></p>
    </div> 
    <div class="px-2 mx-2 navbar-center lg:flex">
        <h1 class="text-3xl font-bold text-black">
            RIC Dev Tool
        </h1>
    </div> 
    <div class="navbar-end">
        <button class="btn btn-error" on:click={logout}>Logout</button>
    </div>
</div>