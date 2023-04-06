import { ActionReducerMap, createFeatureSelector, createSelector,} from '@ngrx/store';
import  * as resultReducer from '@app/store/result/result.reducer';

export interface resultState {
    result : resultReducer.State,
}

export const reducers: ActionReducerMap<any> = {
    result: resultReducer.reducer,
};

export const getStateSelector = createSelector(
    createFeatureSelector('result'),
    resultReducer.state
);