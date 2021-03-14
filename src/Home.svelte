<script>
  import { onMount, getContext } from "svelte";
  import { link, links } from "svelte-navigator";
  import Postbox from "./components/Postbox.svelte";
  import PostView from "./components/PostView.svelte";
  import { timeConverter, getDateDiff, myMarked } from "./utils/util";
  import { warning } from "./components/Notification";
  import API from "./api/Api";
  import InfiniteScroll from "./components/InfiniteScroll.svelte";
  // import { parse } from "QS";
  import Popover from "svelte-popover";
  import Hoverable from "./components/Hoverable.svelte";
  import UserSearchBox from "./components/UserSearchBox.svelte";
  import { userInfoStore, usernameStore, avatarStore,displaynameStore } from "./stores.js";
  import ArticleDetail from "./components/ArticleDetail.svelte";
  import Settings from "./Settings.svelte"
  const { open } = getContext("simple-modal");


  // export let location;
  let avatars = {};
  avatarStore.subscribe((value) => {avatars = value;});
  let usernames = {};
  usernameStore.subscribe((value) => {usernames = value;});
  let displaynames = {};
  displaynameStore.subscribe((value) => {displaynames = value;});


  let articlecells = {};
  let profile = {};

  // let queryParams;
  // $: queryParams = console.log(parse(location?.search.replace("?", "")));

  let coinSound = new Audio("/assets/coin.mp3");
  let flipCoinSound = new Audio("/assets/flipcoin.mp3");

  let showingArticle = {};
  let newBatch = [];
  let timeline = [];
  let maxTS;
  let minTS;
  let replies;

  export let username = "";
  $: if (username) {
    fetchData();
    fetchProfile();
  }
  function fetchProfile() {
    API.get("/get_profile", {
      username: username,
    }).then((res) => {
      profile = res;
      console.log(profile);
    });
  }

  function fetchData(mode = "fresh") {
    API.get(
      username == "" ? "/get_inbox" : "/get_outbox",
      mode == "append"
        ? { less_than_ts: minTS, username: username }
        : mode == "prepend"
        ? { more_than_ts: maxTS, username: username }
        : { username: username }
    ).then((res) => {
      res.users?.forEach((v) => {
        avatars[v.id] = v.avatar;
        usernames[v.id] = v.username;
        displaynames[v.id] = v.display_name;
      });
      avatarStore.set(avatars)
      usernameStore.set(usernames)
      displaynameStore.set(displaynames)
      if (Array.isArray(res.posts) && res.posts.length > 0) {
        newBatch = res.posts;
        timeline =
          mode == "append"
            ? [...timeline, ...newBatch]
            : mode == "prepend"
            ? [...newBatch, ...timeline]
            : newBatch;

        maxTS = timeline[0].created_at;
        minTS = timeline[timeline.length - 1].created_at;

        if (mode == "append") {
          coinSound.play();
        } else {
          flipCoinSound.play();
        }
      }
    });
  }


  // Get the data from the api, after the page is mounted.
  onMount(async () => {
    fetchData("fresh");
    fetchProfile();

  });

    // setInterval(function () {
    //   var ni = timeline[8];
    //   ni.id = ni.id + 1000;
    //   timeline = [ni, ...timeline];
    // }, 30000);
  function refreshReplies(post_id) {
    API.get("/get_replies", { post_id: post_id }).then((res) => {
      replies = res;
    });
  }
  let userSearchText = "";
  const unfollow = (username) => {
    API.post("/unfollow", { username: username }).then((res) => {
      if (res.msg == "ok") {
        $userInfoStore.followings = $userInfoStore.followings.filter(
          (x) => x.username != username
        );
      } else {
        warning(res.msg);
      }
    });
  };
  const follow = (username) => {
    API.post("/follow", { username: profile.user.username }).then((res) => {
      if (res.msg == "ok") {
        $userInfoStore.followings = [
          ...$userInfoStore.followings,
          {
            username: profile.user.username,
            display_name: profile.user.display_name,
          },
        ];
      } else {
        warning(res.msg);
      }
    });
  };
  let notifications = [];
</script>

<svelte:head />
<main>
  <nav
    style=" padding:5px; height:50px; font-size:1.2em; margin-bottom:1.2em; display:fixed;top:0px;"
    class="flex">
    <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
    <a href="/logout" use:link><i class="fa fa-sign-out-alt" aria-hidden="true" /></a>
    <i class="fa fa-cog" aria-hidden="true" on:click={() => {
      open(Settings, { });
    }} />
    
    <Popover
      arrow={false}
      placement="bottom-start"
      on:open={() => {
        API.get("/notifications").then((res) => {
          notifications = [...res, { url: "/user/follow2", message: "test" }];
        });
      }}
      overlayColor="transparent">
      <i class="fa fa-bell" slot="target" aria-hidden="true" />
      <div
        slot="content"
        style="background:white;padding:0; width:300px;height:300px">
        {#each notifications as v}
          <a href={v.url} use:link>{v.message}</a>
        {/each}
      </div>
    </Popover>
    <div>
      <Hoverable let:hovering={isSearchBoxShowing}>
        {#if isSearchBoxShowing || userSearchText != ""}
          <UserSearchBox bind:value={userSearchText} />
        {:else}
          <i class="fa fa-search" aria-hidden="true" />
        {/if}
      </Hoverable>
    </div>
  </nav>
  <div class="left_bar">
    {#if profile.user && ($userInfoStore.followings != undefined)}
      {#if profile?.user?.avatar}
        <img width="40" src={profile?.user?.avatar} alt="avatar" />
      {/if}
      {profile?.user?.display_name} <br />
      <!-- {#if username != "" && username != $userInfoStore.user.username} -->
        {#if $userInfoStore?.followings
          ?.map((x) => x.username)
          .includes(profile.user.username)}
          <button
            on:click={() => {
              unfollow(profile.user.username);
            }}>Unfollow</button>
        {:else}
          <button
            on:click={() => {
              follow(profile.user.username);
            }}>Follow</button>
        {/if}
        <br />
      <!-- {/if} -->
      <div class="marked">
        {@html myMarked(profile?.user?.description)}
      </div>
      Followings: {#each profile.followings as v}
        <a
          href="/user/{v.username}"
          on:click={() => {
            username = v.username;
          }}
          use:link>{v.display_name}</a>
      {/each} <br />
      Followers: {#each profile.followers as v}
        <a
          href="/user/{v.username}"
          on:click={() => {
            username = v.username;
          }}
          use:link>{v.display_name}</a>
      {/each}<br />
      Last Login: <strong>{getDateDiff(profile.user?.last_login)}</strong><br />
      Post Count: <strong>{profile.user?.article_count}</strong><br />
    {/if}
  </div>

  <div class="postbox">
    {#if showingArticle.id === undefined}
      <Postbox
        onSubmit={(txt) => {
          return API.post("/post_post", { content: txt });
        }}
        placeholder="發新噗"
        finishHandler={(id) => {
          API.get(`get_post/${id}`).then((res) => {
            timeline = [res, ...timeline];
          });
        }} />
    {:else}
      <button
        on:click={() => {
          showingArticle = {};
        }}>關閉</button>
      <ArticleDetail {showingArticle} {replies} />
      <div style="width:100%; margin-top:1em">
        <Postbox
          onSubmit={(txt) => {
            return API.post("/post_reply", {
              post_id: showingArticle.id,
              content: txt,
            });
          }}
          placeholder="回覆噗"
          finishHandler={(id) => {
            refreshReplies(showingArticle.id);
          }} />
      </div>
    {/if}
  </div>
  <section class="cells">
    {#each timeline as v, k}
      <article class="cell" bind:this={articlecells[v.id]}>
        <div class="avatar_box">
          {#if avatars[v["user_id"]]}
            <img
              width="20"
              src={avatars[v["user_id"]]}
              class="avatars"
              alt="avatar" />
          {/if}
          <small>
            {displaynames[v["user_id"]]}
            {getDateDiff(v.created_at)}
          </small>
          <small class="reply_count" class:red={v.nor > 0}>{v.nor}</small>
        </div>
        <div
          class="post_content marked"
          on:click={() => {
            showingArticle = v;
            refreshReplies(v.id);
          }}>
          {@html myMarked(v["content"])}
        </div>
      </article>
    {/each}

    <InfiniteScroll
      hasMore={newBatch.length > 0}
      threshold={500}
      on:loadMore={() => {
        fetchData("append");
      }} />
  </section>
</main>

<style>
  .marked {
    word-break: break-all;
  }



  .left_bar {
    width: 300px;
    position: fixed;
    top: 50px;
    left: 1em;
    height: 200px;
    padding: 0;
    margin-block-start: 0;
  }
  .postbox {
    position: fixed;
    width: 300px;
    background-color:black;
    border-radius: .5em;
    left: 1em;
    bottom: 2px;
    z-index: 100;
  }
  .postbox :global(article) {
    max-height: calc(100vh - 400px);

    overflow-y: scroll;
  }
  .cell {
    color: #fbbd2a;
    /* border:1px solid red; */
    box-shadow: 0 0 0 1px #8a463c;
    position: relative;
    overflow: hidden;
    height: 150px;
    padding: 2px;
  }
  .cell .reply_count {
    position: absolute;
    padding: 3px;
    right: 2px;
    top: 2px;
  }
  .cell .red {
    background: red;
    color: aliceblue;
  }
  :global(nav a),
  :global(nav i) {
    color: #fbbd2a;
    display: block;
    width: 30px;
    height: 20px;
  }

  .flex {
    display: flex;
  }
  .cells {
    top: 50px;
    bottom: 10px;
    left: 320px;
    position: fixed;
    width: calc(100vw - 326px);
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
  }

  .cell {
    flex: 0 0 500px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 40em) {
    .cell {
      max-width: calc(50%);
    }
  }

  @media screen and (min-width: 60em) {
    .cell {
      max-width: calc(25%);
    }
  }

  :global(.popover .content) {
    padding: 0;
    border: 1px solid #333;
    border-radius: 3px;
  }
  :global(body) {
    overflow: hidden;
  }
  :global(.cell a) {
    color: #f7694d;
    text-decoration: none;
  }
  :global(article a) {
    color: #f7694d;
    text-decoration: none;
  }
  :global(.cell th) {
    border-bottom: #fbbc2a88 1px solid;
    text-align: left;
    font-weight: 700;
  }
  .post_content {
    padding-left: 0.3em;
    font-size: 13px;
  }
  :global(.post_content table) {
    border-spacing: 0;
  }
  :global(.post_content table td) {
    padding-right: 1em;
    border-bottom: #fbbc2a67 1px solid;
  }
</style>
