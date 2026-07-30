import { describe, it, expect } from '@jest/globals';
import { stepIndexOf, nextStepId, prevStepId, isFirstStep, isLastStep } from './onboarding-navigation';

const steps = [ { id: 'basic' }, { id: 'commission' }, { id: 'withdraw' }, { id: 'appearance' } ];

describe( 'onboarding-navigation', () => {
	it( 'resolves index of a step id', () => {
		expect( stepIndexOf( steps, 'withdraw' ) ).toBe( 2 );
		expect( stepIndexOf( steps, 'missing' ) ).toBe( -1 );
	} );

	it( 'advances and retreats within bounds', () => {
		expect( nextStepId( steps, 'basic' ) ).toBe( 'commission' );
		expect( nextStepId( steps, 'appearance' ) ).toBeNull(); // already last
		expect( prevStepId( steps, 'commission' ) ).toBe( 'basic' );
		expect( prevStepId( steps, 'basic' ) ).toBeNull(); // already first
	} );

	it( 'reports boundaries', () => {
		expect( isFirstStep( steps, 'basic' ) ).toBe( true );
		expect( isLastStep( steps, 'appearance' ) ).toBe( true );
		expect( isLastStep( steps, 'withdraw' ) ).toBe( false );
	} );

	it( 'treats an unknown active id as no movement', () => {
		expect( nextStepId( steps, 'missing' ) ).toBeNull();
		expect( prevStepId( steps, 'missing' ) ).toBeNull();
	} );
} );
