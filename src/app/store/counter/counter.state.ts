import { ActionReducerMap, createFeatureSelector, createSelector,} from '@ngrx/store';
import  * as counterAction from './counter.reducer';

export interface State {
    counter: counterAction.State,
}

export const reducers: ActionReducerMap<any> = {
    counter: counterAction.reducer,
};

export const getStateSelector = createSelector(
    createFeatureSelector('counter'),
    counterAction.state
);