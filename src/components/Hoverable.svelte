<script>
	let hovering;
    let style;

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div {style} on:mouseenter={enter} on:mouseleave={leave}>
	<slot hovering={hovering}></slot>
</div>