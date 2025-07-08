export interface Card {
	lang1: string;
	comment1: string;
	lang2: string;
	comment2: string;
	frequency: number | null;
}

export interface CardState {
	lang1: string;
	lang2: string;
	cards: Card[];
	index: number;
}

export const cardState = $state<CardState>({
	lang1: '',
	lang2: '',
	cards: [],
	index: 0
});
