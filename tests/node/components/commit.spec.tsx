import React from 'react';
import { describe, it, $render, expect } from '../suite';
import Commit from '../../../src/components/commit';
import { spy } from 'sinon';
import { Simulate } from 'react-dom/test-utils';

describe('Commit', () => {
  it('should checkout the commit when clicked', () => {
    const commit = {
      id: 1,
      instance: { state: {} },
      state: {},
      parent: null,
      checkout: spy()
    };

    const $commit = $render(<Commit commit={commit} />);

    Simulate.click($commit[0]);

    expect(commit.checkout).to.have.been.calledOnce;
  });
});
