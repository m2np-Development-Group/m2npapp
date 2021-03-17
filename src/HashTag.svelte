<script>
  import { navigate } from "svelte-navigator";

  export let tag = "";
</script>
<section class="hero is-info">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Hashtag
      </h1>
      <h2 class="subtitle">
        {tag}
      </h2>
    </div>
  </div>
</section>

<button on:click={() => navigate(-1)}>Back</button>
