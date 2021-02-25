<script>
  import { onMount } from "svelte";
  import { link, links } from "svelte-routing";
  import {
    getMyTimeline,
    getPostDetails,
    getAvatarUsernameMaps,
  } from "./api/m2npApi";
  import marked from "marked";
  import { Carousel } from "svelte-images";
  import Postbox from "./components/Postbox.svelte";
  const { Modal, open, close } = Carousel;

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
    style="width:210px; position:fixed; left:1em; height:calc(100vh - 1em); overflow-y:scroll;padding:0;margin-block-start:0"
  >
    <nav style="border-bottom:1px #CCC solid; margin-right:1em;padding:.4em">
      <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
      <a href="/logout" use:link
        ><i class="fa fa-sign-out" aria-hidden="true" /></a
      >
      <a href="/?p=import_from_facebook" target="_blank">Import FB</a>
    </nav>

    <h3 style="padding:0;margin:.3em 0 0">m2np</h3>

    {#each timeline as v}
      <article
        style="border-bottom:1px #DDD solid;padding:.3em;max-height:100px;overflow:hidden"
      >
        <img src={avatars[v["user_id"]]} width="20" alt="avatar" />
        <a href={"/user/" + usernames[v["user_id"]]} use:link
          >{usernames[v["user_id"]]}</a
        >
        <small>{v.json["created_at"]}</small>
        <small>{v.json["post"]}</small>
      </article>
    {/each}
  </menu>

  <section style="margin-left:230px">
    <Postbox />


    <div class="centered">

      <section class="cards">
    

        {#each timeline as v}
        <article
          class='card'
        >
          <div style="padding:.3em;float:left" class="avatar_box">
            <img
              width="32"
              style="display: block;margin-bottom: .5em;margin-left: 3px;float:left"
              src={avatars[v["user_id"]]}
              class="avatars"
              alt="avatar"
            />
            <small
              class="ab_desc"
              style="position: absolute;float: left;padding-left: 1em;background: white;display:none"
            >
              {v.json["created_at"]}<br />
              <small>{usernames[v["user_id"]]}</small>
            </small>
            <div style="clear:both" />
          </div>
          <div style="height:100%;float:left" />
  
          <div style="float:left;width:calc(100% - 80px);padding-left:.3em;font-size:13px">
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
                  }}
                />
              {/each}
            {/if}
          </div>
          <div style="clear:both" />
        </article>
      {/each}
    
    
      </section><!-- .cards -->
    
    </div><!-- .centered -->
    

  </section>
  <Modal />
</main>

<style>
  .card {
    color:#fbbd2a;
    /* border:1px solid red; */
    box-shadow : 0 0 0 1px #8A463C;
    background-color: #1E242C;
    
    overflow: hidden;
    max-height: 150px;
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
      max-width: calc(25% - 1em);
    }
  }
	/* :global(body) {
		background-color: #f2eee2;
		color: #0084f6;
		transition: background-color 0.3s
	} */
	:global(body) {
		background-image: radial-gradient(circle at 0% 0%,#2c3940,#1b1f27 70%);
		color: #bfc2c7;
	}
  :global(.card a) {
    color: #f7694d;
    text-decoration: none;
  }
</style>
