<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { cardState, type Card } from './state.svelte';

	onMount(() => {
		if (cardState.cards.length === 0) {
			goto('/import');
		}
	});

	let chosenCard = $state<number | null>(null);

	const card: Card | undefined = $derived(cardState.cards[cardState.index]);
	interface Answer {
		card: Card;
		correct: boolean;
	}
	let answers: Answer[] = $derived.by(() => {
		const result = [];
		const otherCards = [...cardState.cards].filter((_card, index) => index !== cardState.index);
		for (const _i in [0, 1, 2]) {
			const i = Math.floor(Math.random() * otherCards.length);
			const card = otherCards.splice(i, 1)[0];
			if (!!card) {
				result.push({ card, correct: false });
			}
		}
		if (!!card) {
			result.splice(Math.floor(Math.random() * result.length), 0, {
				card,
				correct: true
			});
		}

		return result;
	});
	let flipped = $derived(chosenCard !== null);

	function onChoose(i: number) {
		if (flipped) {
			return;
		}
		chosenCard = i;
	}
</script>

<main class="container">
	<div class="card" style="font-size: 2rem; margin-bottom: 1rem">
		{#if flipped}
			<span>{card?.lang2}</span>
			<span class="comment">{card?.comment2}</span>
		{:else}
			<span>{card?.lang1}</span>
			<span class="comment">{card?.comment1}</span>
		{/if}
	</div>
	<div class="grid">
		{#each answers as answer, i}
			<button
				class="card"
				class:green={chosenCard === i && answer.correct}
				class:red={chosenCard === i && !answer.correct}
				class:no-bg={chosenCard !== i}
				style="cursor: pointer"
				onclick={() => onChoose(i)}
			>
				<span>{answer.card?.lang2}</span>
				<span>{answer.card?.comment2}</span>
			</button>
		{/each}
	</div>
	<div style="display: flex; justify-content: space-between; margin-top: 2em">
		<button
			onclick={() => {
				cardState.index--;
				chosenCard = null;
			}}>{'< Previous'}</button
		>
		<button
			onclick={() => {
				cardState.index++;
				chosenCard = null;
			}}>{'Next >'}</button
		>
	</div>
</main>

<style>
	.container {
		margin-top: 2em;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid grey;
		border-radius: 1rem;
		padding: 1em;
	}

	.comment {
		font-size: 0.5em;
		color: grey;
		margin-top: 0.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.no-bg {
		background: none;
	}

	.green {
		background: green;
	}

	.red {
		background: red;
	}
</style>
