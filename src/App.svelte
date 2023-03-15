<script>
    import { onMount } from "svelte";
	import {Router, Route} from 'svelte-routing'
    import Login from "./Components/Login.svelte";
	import NavBar from "./Components/NavBar.svelte";
    import ErrorFiles from "./Components/Python_Files/ErrorFiles.svelte";
    import QueueFiles from "./Components/Python_Files/QueueFiles.svelte";
    import ReadyFiles from "./Components/Python_Files/ReadyFiles.svelte";
    import SolvedFiles from "./Components/Python_Files/SolvedFiles.svelte";
</script>
<Router>
	<div class="bg-neutral-content min-h-screen text-white">
		<div class="bg-base-300 min-h-screen max-w-7xl mx-auto p-5">
			<NavBar />
			<Route path= "/">
				<ReadyFiles />
			</Route>

			<Route path= "/error">
				<ErrorFiles />
			</Route>

			<Route path= "/queue">
				<QueueFiles />
			</Route>

			<Route path= "/solved">
				<SolvedFiles />
			</Route>

			<Route path="/login">
				<Login/>
			</Route>
		</div>
	</div>
</Router>