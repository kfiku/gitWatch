import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         RELOADING, UPDATE, DELETE, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END,
         MESSAGE } from '../constants/ActionTypes';

const initialState = {
  addingRepos: false,
  reloadingAllRepos: false,
  message: '',
};

export default function app(state = initialState, action) {
  let newState;
  switch (action.type) {
    case ADDING_REPO:
      newState = JSON.parse(JSON.stringify(state));
      newState.addingRepos = true;
      return newState;

    case ADDING_REPO_END:
      newState = JSON.parse(JSON.stringify(state));
      newState.addingRepos = false;
      return newState;

    case RELOADING_ALL_REPOS:
      newState = JSON.parse(JSON.stringify(state));
      newState.reloadingAllRepos = true;
      return newState;

    case RELOADING_ALL_REPOS_END:
      newState = JSON.parse(JSON.stringify(state));
      newState.reloadingAllRepos = false;
      return newState;

    case MESSAGE:
      newState = JSON.parse(JSON.stringify(state));
      newState.message = action.msg;
      return newState;

    default:
      return state;
  }
}
