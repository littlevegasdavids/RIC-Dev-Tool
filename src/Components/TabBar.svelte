<script>
    let current_page = window.location.pathname
</script>

{#if current_page == "/"}
    <div class="tabs tabs-boxed justify-center">
        <a href="/" class="tab tab-active">Ready</a> 
        <a href="/queue" class="tab">Busy / Queue</a>
        <a href="/solved" class="tab">Solved</a> 
        <a href="/error" class="tab">Error</a>
    </div>
{:else if current_page == "/queue/"}
    <div class="tabs tabs-boxed justify-center">
        <a href="/" class="tab">Ready</a> 
        <a href="/queue" class="tab tab-active">Busy / Queue</a>
        <a href="/solved" class="tab">Solved</a> 
        <a href="/error" class="tab">Error</a>
    </div>

{:else if current_page == "/solved/"}
    <div class="tabs tabs-boxed justify-center">
        <a href="/" class="tab">Ready</a> 
        <a href="/queue" class="tab">Busy / Queue</a>
        <a href="/solved" class="tab tab-active">Solved</a> 
        <a href="/error" class="tab">Error</a>
    </div>
{:else if current_page = "/error/"}
    <div class="tabs tabs-boxed justify-center">
        <a href="/" class="tab">Ready</a> 
        <a href="/queue" class="tab">Busy / Queue</a>
        <a href="/solved" class="tab">Solved</a> 
        <a href="/error" class="tab tab-active">Error</a>
    </div>
{/if}