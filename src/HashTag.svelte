<script>
  import { navigate } from "svelte-navigator";

  export let tag = "";
</script>

<h1>Hashtag</h1>
{tag}
<button on:click={() => navigate(-1)}>Back</button>
