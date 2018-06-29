import {types} from 'mobx-state-tree';

const User = types.model({
    address: types.string,
    model: types.frozen
}).actions(self => ({
    updateAddr(address: string) {
        self.address = address;
    },
    update(model: any) {
        self.model = model;
    }

}));

const DEFAULT = {
    address: '',
    model: null
};

export { User as Model, DEFAULT }