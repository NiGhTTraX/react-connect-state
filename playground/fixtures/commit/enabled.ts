// eslint-disable-next-line no-unused-vars
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Commit from '../../../src/components/commit';
import createFixture from '../../fixture-helper';

export default createFixture(Commit, {
  Tooltip,
  commit: {
    id: 1,
    parent: null,
    checkout: () => {},
    state: { foo: 'bar' },
    instance: { state: { foo: 'bar' } }
  }
});
