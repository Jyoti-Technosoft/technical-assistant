import { ActionReducerMap, createFeatureSelector, createSelector,} from '@ngrx/store';
import  * as autenticationReducer from '@app/store/autentication/autentication.reducer';

export interface autenticationState {
    Authentication : autenticationReducer.State,
}

export const reducers: ActionReducerMap<any> = {
    counter: autenticationReducer.reducer,
};

export const getStateSelector = createSelector(
    createFeatureSelector('Autentication'),
    autenticationReducer.state
);