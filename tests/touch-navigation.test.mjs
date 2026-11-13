import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resetSlideMove } from '../src/js/core/touch-navigation.js';

describe('resetSlideMove', () => {
    it('returns when the slide is null', () => {
        assert.equal(resetSlideMove(null), undefined);
    });

    it('returns when the slide is undefined', () => {
        assert.equal(resetSlideMove(undefined), undefined);
    });
});
