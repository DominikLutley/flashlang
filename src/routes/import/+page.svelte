<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { cardState } from '../state.svelte';
	import Papa from 'papaparse';
	import { goto } from '$app/navigation';

	const onUploadCsv: ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			const text = e.target?.result;
			if (typeof text !== 'string') {
				console.error('text is not string: ', text);
				return;
			}
			const data = Papa.parse<string[]>(text);
			if (data.errors.length > 0) {
				console.error(data.errors);
			}
			const rows = data.data;
			const header = rows.shift();
			if (!header) {
				console.error('file empty');
				return;
			}
			const [lang1, _, lang2] = header;
			cardState.lang1 = lang1;
			cardState.lang2 = lang2;
			for (const row of rows) {
				const [lang1, comment1, lang2, comment2, f] = row;
				if (!lang1 || !lang2) {
					continue;
				}
				const frequency = Number(f);
				cardState.cards.push({
					lang1,
					comment1,
					lang2,
					comment2,
					frequency: Number.isNaN(frequency) ? null : frequency
				});
			}

			goto('/');
		};

		reader.onerror = (err) => {
			console.error('Error reading file', err);
		};

		reader.readAsText(file);
	};
</script>

<main>
	<input type="file" accept=".csv" style="width: auto;" onchange={onUploadCsv} />
</main>

<style>
	main {
		width: 100dvw;
		height: 100dvh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
