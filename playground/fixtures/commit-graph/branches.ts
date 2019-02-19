/* eslint-disable prefer-destructuring */
import master from './master';
import createBranch from '../../factories/commit';
import { extendFixture } from '../../fixture-helper';

const masterBranch = createBranch(5);
const activeBranch = createBranch(4);
const inactiveBranch = createBranch(7);
const anotherInactiveBranch = createBranch(2);

activeBranch[0].parent = masterBranch[2];
inactiveBranch[0].parent = masterBranch[1];
anotherInactiveBranch[0].parent = activeBranch[3];

export default extendFixture(master, {
  commitGraph: {
    state: {
      branches: [
        masterBranch,
        activeBranch,
        inactiveBranch,
        anotherInactiveBranch
      ],
      activeBranch: 1,
      head: activeBranch[activeBranch.length - 1]
    },
    reset: () => {}
  }
});
