export type StepRef = { id: string };

export function stepIndexOf( steps: StepRef[], id: string ): number {
	return steps.findIndex( ( s ) => s.id === id );
}

export function nextStepId( steps: StepRef[], current: string ): string | null {
	const i = stepIndexOf( steps, current );
	if ( i < 0 || i >= steps.length - 1 ) return null;
	return steps[ i + 1 ].id;
}

export function prevStepId( steps: StepRef[], current: string ): string | null {
	const i = stepIndexOf( steps, current );
	if ( i <= 0 ) return null;
	return steps[ i - 1 ].id;
}

export function isFirstStep( steps: StepRef[], id: string ): boolean {
	return stepIndexOf( steps, id ) === 0;
}

export function isLastStep( steps: StepRef[], id: string ): boolean {
	const i = stepIndexOf( steps, id );
	return i >= 0 && i === steps.length - 1;
}
