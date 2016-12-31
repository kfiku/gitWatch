import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sortable = require('sortablejs');

import { renderLog } from '../../helpers/logger';
import actions from '../../actions';
import Repo from './Repo';


const onAddRepo = (actions, event) => {
    /**
     * Put dragged element back to `from` node.
     * It's needed to avoid React VIRTUAL DOM cleanup.
     * Otherwise You will get error `can't remove element...`
     */
    event.from.appendChild(event.item);

    actions.reorderRepo({
      from: Number(event.from.getAttribute('data-group-i')),
      to: Number(event.to.getAttribute('data-group-i')),
      oldIndex: event.oldIndex,
      newIndex: event.newIndex
    });
  }
const onUpdateRepo = (actions, event) => {
  actions.reorderRepo({
    from: Number(event.from.getAttribute('data-group-i')),
    to: Number(event.to.getAttribute('data-group-i')),
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const sortableRepos = (actions, el) => {
  if (el) {
    setTimeout(() => {
      let options = {
        animation: 150,
        handle: '.repo-mover',
        draggable: '.repo',
        forceFallback: true,
        group: 'shared-repos',
        onUpdate: onUpdateRepo.bind(null, actions),
        onAdd: onAddRepo.bind(null, actions)
      };

      Sortable.create(el, options);
    }, 200);

  }
};

const ReposComponent: any = ({repos, group, actions, i}: { repos: IRepo[], group: IGroup, actions: any, i: number }) => {
  renderLog('REPOS', repos.length);

  let reposNodes = repos.map(repo => (
    <Repo key={ repo.dir } group-id={ group.id } repo-dir={ repo.dir } />
  ))

  return (
    <div className='repos' data-group-i={ i } ref={ sortableRepos.bind(null, actions) }>
      { reposNodes }
    </div>
  );
};

ReposComponent.propTypes = {
  repos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired
};


const mapStateToProps = (state, ownProps = {}) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  const repos = group.repos;

  return { repos, group: { id: ownProps['group-id'] }, i: ownProps['group-i'] };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Repos = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReposComponent);

export default Repos;