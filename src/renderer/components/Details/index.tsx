// import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as moment from 'moment';
import { basename } from 'path';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Isvg = require('react-inlinesvg');
import actionsToConnect from '../../actions';
import { renderLog } from '../../helpers/logger';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import Status from '../Repos/Status';
import StyledRepoDetails from './StyledRepoDetails';

import Diff from './Diff';
import GitGuiBtn from './GitGuiBtn';
import Header from './Header';

// const updateDate = (repo, el) => {
//   setTimeout(() => {
//     if (el && el.innerHTML) {
//       el.innerHTML = moment(repo.lastUpdate).fromNow();
//       updateDate(repo, el);
//     }
//   }, 5 * 60 * 1000); // 5 minutes
// };

const RepoDetailsComponent: any = ({repo, actions}: { repo: IRepo, actions: any }) => {
  if (!repo) {
    renderLog('REPO DETAILS EMPTY');
    return <div></div>;
  }

  renderLog('REPO DETAILS', repo.name || basename(repo.dir));

  let cls = '';

  if (repo.behind) {
    cls = 'behind';
  } else if (repo.ahead) {
    cls = 'ahead';
  } else if (repo.modified && repo.modified.length) {
    cls = 'modified';
  }

  const modified = repo.modified && repo.modified.map(file => (
    <li key={ file }>
      { file }
    </li>
  ));

  const untracked = repo.untracked && repo.untracked.map(file => (
    <li key={ file }>
      { file }
    </li>
  ));

  return (
    <StyledRepoDetails className={ 'repo-details ' + cls }>
      <Header actions={actions} repo={repo}/>
      <div className='content'>
        { repo.modified && repo.modified.length ?
          <div>
            <h4>Modified: { repo.modified.length }</h4>
            <ul>
              { modified }
            </ul>
          </div> : ''
        }

        { repo.untracked && repo.untracked.length ?
          <div>
            <h4>Untracked: { repo.untracked.length }</h4>
            <ul>
              { untracked }
            </ul>
          </div> : ''
        }

        <p className='updated' title='Updated from now' /*ref={ updateDate.bind(null, repo) }*/>
          Updated: { moment(repo.lastUpdate).fromNow() }
        </p>

        <Diff dir={ repo.dir }/>

      </div>
    </StyledRepoDetails>
  );
};

RepoDetailsComponent.propTypes = {
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
  const repo = state.repos.filter(r => r.id === state.app.repoShown)[0];

  return { repo };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const RepoDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoDetailsComponent);

export default RepoDetails;
