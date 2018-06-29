import {types} from 'mobx-state-tree';
import * as User from './user';
import * as Language from "./language";
import * as SiteState from "./siteState"

const Store = types.model('Store', {
    language: Language.Model,
    user: User.Model,
    siteState: SiteState.Model,
});

const store = Store.create({
    language: Language.DEFAULT,
    user: User.DEFAULT,
    siteState: SiteState.DEFAULT
});

export default store;
