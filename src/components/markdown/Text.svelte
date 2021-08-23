<script>
    import Link from './Link.svelte';
    export let text; text;
    export let raw; raw;

    if(text!=raw){
        console.log(text)
        console.log(raw)
    }
    
    let parts = [];
    if(text != ""){
        const regexMention = new RegExp(/@([a-z\d_]+)/gi);
        const regexHash = new RegExp(/\B#([\u4e00-\u9fa5_a-zA-Z0-9]+)/g);
        const all = text.split(" ");
        all.forEach(e=>{
            if(regexMention.test(e)){
                parts.push(
                    {
                        component: Link,
                        props: { href : "/user/"+e.substring(1) },
                        slot : e
                    }
                )
            }else if(regexHash.test(e)){
                parts.push(
                    {
                        component: Link,
                        props: { href : "/search/"+e.substring(1) },
                        slot : e
                    }
                )
            }else{
                parts.push(
                    {
                        text:e
                    }
                )
            }
        })
    }
</script>
{#each parts as component}
    {#if component.hasOwnProperty('text')}
    {component.text}
    {:else}
    <svelte:component this={component.component} { ...component.props }>{component.slot}</svelte:component>
    {/if}
    &nbsp;
{/each}


<!-- <slot /> -->
