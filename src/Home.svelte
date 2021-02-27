<script>
  import { onMount, getContext } from "svelte";
  import { link, links } from "svelte-routing";
  import marked from "marked";
  import Postbox from "./components/Postbox.svelte";
  import PostView from "./components/PostView.svelte";
  import { timeConverter } from "./utils/util";
  import API from "./api/Api";
  import App from "./App.svelte";
  const { open } = getContext("simple-modal");

  const showPostView = (id, imageId) => {
    open(PostView, { postId: id, imageId: imageId });
  };

  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) =>
    `<a target="_blank" href="${href}">${text}</a>`; //title="${ title }"
  const markedOptions = { renderer: renderer, breaks: true };

  const isArray = Array.isArray;
  let postDetail = {};
  let timeline = [];
  let avatars = {};
  let usernames = {};
  let articleCards = {};
  let profile = {};

  // Get the data from the api, after the page is mounted.
  onMount(async () => {
    API.get("/get_timeline").then((res) => {
      timeline = res;
      timeline.map((x) => {
        x.Active = false;
      });
    });

    API.get("/get_avatar_username_maps").then((res) => {
      avatars = res[0];
      usernames = res[1];
    });

    API.get("/get_profile").then((res) => {
      profile = res;
    });

    // setInterval(function () {
    //   var ni = timeline[8];
    //   ni.id = ni.id + 1000;
    //   timeline = [ni, ...timeline];
    // }, 30000);
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
  <div
    style="width:200px; position:fixed; left:1em; height:calc(100vh - 1em); padding:0;margin-block-start:0">
    <nav style="border-bottom:1px #CCC solid; margin-right:1em;padding:.4em">
      <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
      <a href="/logout" use:link
        ><i class="fa fa-sign-out" aria-hidden="true" /></a>
    </nav>

    <img width="40" src={profile?.user?.avatar} alt="avatar" />
    Abby Chau <br /><br />

    {@html profile?.user?.description
      ? marked(profile?.user?.description, markedOptions)
      : ""}

    Followings: {JSON.stringify(profile.followings)} <br />
    Followers: {JSON.stringify(profile.followers)} <br /><br />
    Last Login: <strong>{timeConverter(profile.user?.last_login)}</strong><br />
    Post Count: <strong>{profile.user?.article_count}</strong><br />
  </div>

  <section style="margin-left:220px">
    <Postbox
      finishHandler={(id) => {
        API.get(`get_post/${id}`).then((res) => {
          timeline = [res, ...timeline];
        });
      }} />
    <div class="centered">
      <section class="cards">
        {#each timeline as v, k}
          <article
            class="card"
            bind:this={articleCards[v.id]}
            class:active={v.Active}>
            <div class="avatar_box">
              <img
                width="20"
                src={avatars[v["user_id"]]}
                class="avatars"
                alt="avatar" />
              <small on:click={() => showPostView(v["id"])}>
                {usernames[v["user_id"]]}
                {timeConverter(v.created_at)}
              </small>
            </div>
            <div
              style="padding-left:.3em;font-size:13px"
              on:click={() => {
                if (v.Active) {
                  timeline[k].Active = false;
                } else {
                  timeline.map((x) => {
                    x.Active = x.id == v.id;
                  });
                }
                timeline = timeline;
                console.log(timeline);
              }}>
              {@html marked(v.json["post"], markedOptions)}

              {#if isArray(v.json["images"])}
                {#each v.json["images"] as image, i}
                  <img
                    width="20%"
                    src={image["src"]}
                    alt={image["alt"]}
                    on:click={() => showPostView(v["id"])} />
                {/each}
              {/if}
            </div>
            {#if v.Active}
              <textarea />按 Enter 送出
            {/if}
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
  .card.active {
    height: 300px;
    max-width: 100%;
    width: calc(100% - 1em);
    flex: 0 0 100%;
    position: static;
    border: 2px solid #fbbd2a;
    overflow-y: scroll;
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
    flex: 0 0 500px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 40em) {
    .card {
      max-width: calc(50%);
    }
  }

  @media screen and (min-width: 60em) {
    .card {
      max-width: calc(25%);
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
