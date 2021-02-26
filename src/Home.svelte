<script>
  import { onMount, getContext } from "svelte";
  import { link, links } from "svelte-routing";
  import {
    getMyTimeline,
    getPostDetails,
    getAvatarUsernameMaps,
  } from "./api/m2npApi";
  import marked from "marked";
  import Postbox from "./components/Postbox.svelte";
  import PostView from "./components/PostView.svelte";
  import { timeConverter } from "./utils/util";
  const { open } = getContext("simple-modal");

  const showPostView = () => {
    open(PostView, { id: "It's a modal!" });
  };

  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) =>
    `<a target="_blank" href="${href}">${text}</a>`; //title="${ title }"

  const isArray = Array.isArray;
  let postDetail = {};
  let timeline = [];
  let avatars = {};
  let usernames = {};

  // Get the data from the api, after the page is mounted.
  onMount(async () => {
    const res = await getMyTimeline();
    timeline = res;

    const res2 = await getAvatarUsernameMaps();
    avatars = res2[0];
    usernames = res2[1];

    setInterval(function () {
      timeline = [timeline[8], ...timeline];
    }, 10000);
  });

  // const handleOnClick = (event) => {
  //   const name = event.target.name;
  //   getPostDetails(name).then((res) => {
  //     postDetail = res;
  //   });
  // };
</script>

<svelte:head />
<main>
  <menu
    style="width:210px; position:fixed; left:1em; height:calc(100vh - 1em); overflow-y:scroll;padding:0;margin-block-start:0">
    <nav style="border-bottom:1px #CCC solid; margin-right:1em;padding:.4em">
      <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
      <a href="/logout" use:link
        ><i class="fa fa-sign-out" aria-hidden="true" /></a>
      <a href="/?p=import_from_facebook" target="_blank">Import FB</a>
    </nav>

    <h3 style="padding:0;margin:.3em 0 0">m2np</h3>

    {#each timeline as v}
      <article style="max-height:100px;overflow:hidden;font-size:10pt">
        <img src={avatars[v["user_id"]]} width="20" alt="avatar" />
        <a href={"/user/" + usernames[v["user_id"]]} use:link
          >{usernames[v["user_id"]]}</a>
        <small>{timeConverter(v.json["created_at"])}</small>
        <small>{v.json["post"]}</small>
      </article>
    {/each}
  </menu>

  <section style="margin-left:230px">
    <Postbox />

    <div class="centered">
      <section class="cards">
        {#each timeline as v}
          <article class="card">
            <div class="avatar_box">
              <img
                width="20"
                src={avatars[v["user_id"]]}
                class="avatars"
                alt="avatar" /><small on:click={() => showPostView(v["id"])}
                >{usernames[v["user_id"]]}
                {timeConverter(v.json["created_at"])}</small>
            </div>
            <div style="padding-left:.3em;font-size:13px">
              {@html marked(v.json["post"], { renderer: renderer })}

              {#if isArray(v.json["images"])}
                {#each v.json["images"] as image, i}
                  <img
                    width="20%"
                    src={image["src"]}
                    alt={image["alt"]}
                    on:click={() => {
                      setTimeout(() => {
                        open(v.json["images"], i);
                      }, 0);
                    }} />
                {/each}
              {/if}
            </div>
            <div style="clear:both" />
          </article>
        {/each}
      </section>
      <!-- .cards -->
    </div>
    <!-- .centered -->
  </section>
</main>

<style>
  .card {
    color: #fbbd2a;
    /* border:1px solid red; */
    box-shadow: 0 0 0 1px #8a463c;
    background-color: #1e242c;

    overflow: hidden;
    height: 150px;
  }

  nav a {
    color: #fbbd2a;
  }

  /* Flexbox stuff */

  .cards {
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    flex: 1 0 500px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 40em) {
    .card {
      max-width: calc(50% - 1em);
    }
  }

  @media screen and (min-width: 60em) {
    .card {
      max-width: calc(25% - 0.1em);
    }
  }
  /* :global(body) {
		background-color: #f2eee2;
		color: #0084f6;
		transition: background-color 0.3s
	} */
  :global(body) {
    background-image: radial-gradient(circle at 0% 0%, #2c3940, #1b1f27 70%);
    color: #bfc2c7;
    font-family: monospace;
  }
  :global(.card a) {
    color: #f7694d;
    text-decoration: none;
  }
  :global(article a) {
    color: #f7694d;
    text-decoration: none;
  }
</style>
