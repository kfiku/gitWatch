import * as React from 'react';
import { basename } from 'path';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import actionsToConnect from '../../actions';
import { renderLog } from '../../helpers/logger';
import StyledRepoDetails from './StyledRepoDetails';
import Diff from './Diff';
import Header from './Header';
import FileList from './FileList';

import '../../css/file-icons.css';

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

  return (
    <StyledRepoDetails className={ 'repo-details ' + cls }>
      <Header actions={actions} repo={repo}/>

      <div className='content'>
        { repo.modified && repo.modified.length ?
          <div>
            <h4>Modified: { repo.modified.length }</h4>
            <FileList files={repo.modified} />
          </div> : ''
        }

        { repo.untracked && repo.untracked.length ?
          <div>
            <h4>Untracked: { repo.untracked.length }</h4>
            <FileList files={repo.untracked} />
          </div> : ''
        }

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
