<script>
  import { myInfoStore } from "../stores";
  import { getDateDiff } from "../utils/util";
  import { Button } from "svelma";
  import Username from "../components/Username.svelte";
  import Markdown from "../components/Markdown.svelte";

  const unfollow = (user) => {
    API.post("/unfollow", { user_id: user.id }).then((res) => {
      if (res.msg == "ok") {
        $myInfoStore.followings = $myInfoStore.followings.filter(
          (x) => x.id != user.id
        );

        profile.followers = profile.followers.filter((x) => x.id != user.id);
      } else {
        Warning(res.msg);
      }
    });
  };
  const follow = (user) => {
    API.post("/follow", { user_id: user.id }).then((res) => {
      if (res.msg == "ok") {
        let smallUser = {
          display_name: user.display_name,
          id: user.id,
          username: user.username,
        };
        $myInfoStore.followings = [...$myInfoStore.followings, smallUser];
        profile.followers = [...profile.followers, smallUser];
      } else {
        Warning(res.msg);
      }
    });
  };

  export let profile = {};
  export let showWallpaper = false;
</script>

<div style="position:relative">
  {#if showWallpaper}
    <div
      class="wallpaper"
      style="background-image: url({profile.user.wallpaper});"
    />
  {/if}

  {#if profile.user}
    <div style="padding:1em;background:white">
      <table>

        <tr>
          <td>
            {#if profile?.user?.avatar}
            <img width="80" src={profile?.user?.avatar} alt="avatar" />
          {/if}
          </td>
          <td style='padding-left:1em'>

            <a href={`/user/${profile.user.username}`}>{profile?.user?.display_name}</a>
            <!-- {JSON.stringify($myInfoStore?.followers)} -->
            {#if $myInfoStore?.followers?.map((x) => x.id).includes(profile.user.id)}
              <small>(正在跟隨你)</small>
            {/if}
            <br />
            {#if profile.user.id != $myInfoStore?.user?.id}
              {#if $myInfoStore?.followings
                ?.map((x) => x.id)
                .includes(profile.user.id)}
                <Button
                  size="is-small"
                  iconRight="arrow-right"
                  on:click={() => {
                    unfollow(profile.user);
                  }}>取消跟隨</Button
                >
              {:else}
                <Button
                  size="is-small"
                  iconLeft="arrow-right"
                  on:click={() => {
                    follow(profile.user);
                  }}>跟隨</Button
                >
              {/if}
            {/if}

            

          </td>
        </tr>
      </table>




      <div style="font-size:13px;color:#666">
        跟蹤:<br />
        {#if profile.followings.length > 0}
          {#each profile.followings as v}
            <Username userId={v.id} /><br />
          {/each}
        {:else}
          沒有
        {/if}
        <br />
        粉絲: <br />
        {#if profile.followers.length > 0}
          {#each profile.followers as v}
            <Username userId={v.id} /><br />
          {/each}
        {:else}
          沒有
        {/if}
        <br />
        自介: <br />

        <Markdown content={profile?.user?.description} />

        <br />
        <br />
        最後登入: <strong>{getDateDiff(profile.user?.last_login)}</strong><br />
        Po文: <strong>{profile.user?.article_count}</strong>則
      </div>
    </div>
  {/if}
</div>

<style>
  .wallpaper {
    background-color: #eee;
    background-size: cover;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.6;
  }
</style>
