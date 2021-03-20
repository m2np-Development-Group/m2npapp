<script>
  import { onMount } from "svelte";
  import API from "../api/Api";
  import { Tabs, Tab } from "svelma2";
  let myEmojis = [];

  onMount(() => {
    API.get("/my_emojis", {}).then((res) => {
      myEmojis = res;
      myEmojis = [
        {
          name: "cateName1",
          icons: [
            {
              row: 0,
              col: 1,
              url: "https://images.plurk.com/QLDxaVYwo3Zf3s0y1wJYt.jpg",
              iid: "c0",
            }
          ],
        },
        {
          name: "cateName2",
          icons: [
            {
              row: 1,
              col: 2,
              url: "https://images.plurk.com/QLDxaVYwo3Zf3s0y1wJYt.jpg",
              iid: "c2s",
            },
          ],
        },
      ];
    });
  });

  const insert = () => {};
  
</script>

<div>
  <Tabs>
      
    {#each myEmojis as { name, icons }}
    
      <Tab label={name}>
        <table>
          {#each Array(3) as _, row}
            <tr>
              {#each Array(3) as _, cell}
                <td>{row}{cell}
                  {#each icons as icon}
                  {JSON.stringify(icon.row==row)}
                    {#if icon.row == row && icon.cell == cell}
                    {icon.cell}
                      <img
                        src={cell.url}
                        alt={cell.iid}
                        on:click={() => {
                          insert(cell.iid);
                        }} />
                    {/if}
                  {/each}
                </td>
              {/each}
            </tr>
          {/each}
        </table>
      </Tab>
    {/each}
  </Tabs>
</div>
