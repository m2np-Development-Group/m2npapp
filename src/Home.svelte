<script>
  import { onMount, getContext } from "svelte";
  import { link } from "svelte-navigator";
  import Postbox from "./components/Postbox.svelte";
  import { exists, getDateDiff, myMarked } from "./utils/util";
  import { Warning } from "./components/Notification";
  import API from "./utils/Api";
  import InfiniteScroll from "./components/InfiniteScroll.svelte";
  // import { parse } from "QS";
  import Popover from "svelte-popover";
  import Hoverable from "./components/Hoverable.svelte";
  import AvatarBox from "./components/AvatarBox.svelte";
  import UserSearchBox from "./components/UserSearchBox.svelte";
  import Username from "./components/Username.svelte";
  import { myInfoStore, userStore, docClicked } from "./stores.js";
  import ArticleDetail from "./components/ArticleDetail.svelte";
  import Settings from "./Settings.svelte";
  import Search from "./components/Search.svelte";

  import tooltip from "svelte-tooltip-action";
  import { Button, Modal, ModalCard } from "svelma2";

  let articlecells = {};
  let profile = {};

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
      if (res.msg != "ok") {
        if (res.msg == "user not found") {
          coverMessage = "查無此人";
        }
      } else {
        profile = res.data;
      }
    });
  }

  //"fresh" =new
  //"prepend" =load new
  //"append" = load old
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
        $userStore.avatar[v.id] = v.avatar;
        $userStore.username[v.id] = v.username;
        $userStore.displayname[v.id] = v.display_name;
        $userStore.color[v.id] = v.color;
      });
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
        if ($docClicked) {
          if (mode == "append") {
            coinSound.play();
          } else {
            flipCoinSound.play();
          }
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
        $myInfoStore.followings = $myInfoStore.followings.filter(
          (x) => x.username != username
        );
      } else {
        Warning(res.msg);
      }
    });
  };
  const follow = (username) => {
    API.post("/follow", { username: profile.user.username }).then((res) => {
      if (res.msg == "ok") {
        $myInfoStore.followings = [
          ...$myInfoStore.followings,
          {
            username: profile.user.username,
            display_name: profile.user.display_name,
          },
        ];
      } else {
        Warning(res.msg);
      }
    });
  };
  let notifications = [];
  let showSettings = false;
  let cellsSection;
  let coverMessage = "";
  let showSearch = false;
</script>

<main>
  <div class="modal" class:is-active={coverMessage != ""}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" />
        <!-- <button class="delete" aria-label="close" on:click={()=>{coverMessage=""}}></button> -->
      </header>
      <section class="modal-card-body">
        {coverMessage}
      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button is-success" on:click={()=>{coverMessage=""}}>OK</button> -->
      </footer>
    </div>
  </div>

  <Modal bind:active={showSettings} title="設定">
    <div style="background:white;padding:1em;border-radius:1em">
      <Settings active={showSettings} />
    </div>
  </Modal>
  <Modal bind:active={showSearch} title="搜尋">
    <div style="background:white;padding:1em;border-radius:1em">
      <Search />
    </div>
  </Modal>
  <nav
    style="display:flex;padding:10px; height:50px; margin-bottom:1.2em; position:fixed;top:0px;z-index:3;left:2px;font-size:18px">
    <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
    <a href="/logout" use:link
      ><i class="fa fa-sign-out-alt" aria-hidden="true" /></a>
    <i
      class="fa fa-cog"
      aria-hidden="true"
      on:click={() => {
        showSettings = !showSettings;
      }} />

    <Popover
      overlayColor="rgba(0,0,0,0.1)"
      arrow={true}
      placement="bottom-start"
      on:open={() => {
        API.get("/notifications").then((res) => {
          notifications = res;
        });
      }}
      arrowColor="#fff">
      <i
        class="fa fa-bell"
        slot="target"
        aria-hidden="true"
        use:tooltip={{
          text: "Notifications",
          style: "left: 0; bottom: -40px;",
        }} />
      <div slot="content">
        <div class="popover_content">
          {#if notifications.length > 0}
            {#each notifications as v}
              <a href={v.url} use:link>{v.message}</a>
            {/each}
          {:else}
            🤗沒有通知很棒棒
          {/if}
        </div>
      </div>
    </Popover>
    <div>
      <i
        class="fa fa-search"
        aria-hidden="true"
        on:click={() => {
          showSearch = !showSearch;
        }} />
      <!-- <Hoverable let:hovering={isSearchBoxShowing}>
        {#if isSearchBoxShowing || userSearchText != ""}
          <UserSearchBox bind:value={userSearchText} />
        {:else}
          <i class="fa fa-search" aria-hidden="true" />
        {/if}
      </Hoverable> -->
    </div>
  </nav>
  <div class="left_bar">
    {#if profile.user && exists($myInfoStore.followings)}
      {#if profile?.user?.avatar}
        <img width="40" src={profile?.user?.avatar} alt="avatar" />
      {/if}
      {profile?.user?.display_name}
      <!-- {#if username != "" && username != $myInfoStore.user.username} -->
      {#if $myInfoStore?.followings
        ?.map((x) => x.username)
        .includes(profile.user.username)}
        <Button
          size="is-small"
          iconRight="arrow-right"
          on:click={() => {
            unfollow(profile.user.username);
          }}>Unfollow</Button>
      {:else}
        <Button
          size="is-small"
          iconLeft="arrow-right"
          on:click={() => {
            follow(profile.user.username);
          }}>Follow</Button>
      {/if}
      <br />
      <br />
      <!-- {/if} -->
      <div class="marked">
        {@html myMarked(profile?.user?.description)}
      </div>

      正在跟蹤:<br />

      {#each profile.followings as v}
        <Username userId={v.id} /><br />
      {/each} <br />

      跟隨者: <br />
      {#each profile.followers as v}
        <Username userId={v.id} /><br />
      {/each}<br />
      最後登入: <strong>{getDateDiff(profile.user?.last_login)}</strong><br />
      噗數: <strong>{profile.user?.article_count}</strong><br />
    {/if}
  </div>

  <div class="postbox">
    {#if exists(showingArticle.id)}
      <Button
        style="position: absolute;right: .3em; z-index:4;"
        size="is-small"
        on:click={() => {
          showingArticle = {};
        }}
        iconRight="times"
        rounded>關閉</Button>
      <ArticleDetail
        onArticleContentChanged={(content) => {
          timeline = timeline.map((v) => {
            if (v.id == showingArticle.id) {
              v.content = content;
            }
            return v;
          });
        }}
        onDelete={() => {
          timeline = timeline.filter((v) => v.id != showingArticle.id);
          showingArticle = {};
        }}
        article={showingArticle}
        replies={replies} />
    {/if}

    <div style="width:100%;">
      <Postbox
        onSubmit={(txt) => {
          if (exists(showingArticle.id)) {
            return API.post("/post_reply", {
              post_id: showingArticle.id,
              content: txt,
            });
          } else {
            return API.post("/post_post", { content: txt });
          }
        }}
        placeholder={exists(showingArticle.id) ? "回覆噗" : "發新噗"}
        finishHandler={(content) => {
          if (exists(showingArticle.id)) {
            refreshReplies(showingArticle.id);
          } else {
            fetchData("prepend");
          }
        }} />
    </div>
  </div>
  <div style="position:fixed;right:1em;top:0.5em">
    <Button
      size="is-small"
      on:click={() => {
        const element = cellsSection;
        element.scrollTop = 0;

        fetchData("prepend");
      }}
      rounded
      iconRight="arrow-up">Prepend</Button>
    <Button
      size="is-small"
      on:click={() => {
        const element = cellsSection;
        element.scrollTop = element.scrollHeight;

        fetchData("append");
      }}
      rounded
      iconRight="arrow-down">Append</Button>
  </div>
  <div class="rightColumn" bind:this={cellsSection}>
    <section class="cells">
      {#each timeline as v, k}
        <article class="cell" bind:this={articlecells[v.id]}>
          <AvatarBox userId={v["user_id"]}>
            <small>{getDateDiff(v.created_at)}</small>
            <small class="reply_count" class:red={v.nor > 0}>{v.nor}</small>
          </AvatarBox>

          <div
            class="post_content marked"
            style="overflow:hidden;position:absolue;padding-top:3px;max-height:calc(100% - 40px)"
            on:click={() => {
              showingArticle = v;
              refreshReplies(v.id);
            }}>
            {@html myMarked(v["content"])}
          </div>
        </article>
      {/each}
    </section>

    <InfiniteScroll
      hasMore={newBatch.length > 0}
      threshold={500}
      on:loadMore={() => {
        fetchData("append");
      }} />
  </div>
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
    width: 310px;
    background-color: #efefef;
    border-radius: 0.5em;
    left: 3px;
    bottom: 3px;
    z-index: 1;
    padding: 0.3em;
    max-height: calc(100vh - 50px);
  }
  /* .postbox :global(article) {
    max-height: calc(100vh - 400px);
  } */
  .cell {
    /* color: #fbbd2a; */
    /* border:1px solid #DEDEDE; */

    box-shadow: 1px 3px 3px 1px #dedede;
    border-radius: 0.5em;
    padding: 0.5em;
    position: relative;
    /* overflow: hidden; */
    height: 150px;
    margin: 0;
  }
  :global(.reply_count.red) {
    background: red;
    color: aliceblue;
    margin-top: 2px;
    padding: 0 3px;
  }

  :global(nav i) {
    color: dimgray;
    display: inline-block;
    padding: 5px 5px;
    height: 20px;
    vertical-align: top;
  }

  .rightColumn {
    top: 35px;
    bottom: 10px;
    left: 320px;
    position: fixed;
    width: calc(100vw - 326px);
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .cells {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: fit-content;
  }
  .cell {
    flex: 0 0 500px;
    margin: 5px;

    box-sizing: border-box;
  }
  @media screen and (min-width: 40em) {
    .cell {
      max-width: calc(50% - 10px);
    }
  }

  @media screen and (min-width: 60em) {
    .cell {
      max-width: calc(25% - 10px);
    }
  }

  :global(body) {
    overflow: hidden;
  }
  :global(.cell a) {
    /* color: #f7694d; */
    /* text-decoration: none; */
  }
  :global(article a) {
    /* color: #f7694d; */
    /* text-decoration: none; */
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
