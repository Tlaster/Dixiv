import {types} from "mobx-state-tree";

const SiteState = types.model({
    loading: types.boolean,
    api: types.frozen,
    contractAddress: types.string,
    nebState: types.frozen,
    nebPay: types.frozen,
    isRegisterShowing: types.boolean,
    notification: types.string,
    isNotificationShowing: types.boolean
}).actions(self => ({
    setLoading(loading: boolean) {
        self.loading = loading;
    },
    setApi(api: any) {
        self.api = api;
    },
    setNebState(state: any) {
        self.nebState = state;
    },
    setNebPay(pay: any) {
        self.nebPay = pay;
    },
    sendNotification(message: string) {
        self.notification = message;
        self.isNotificationShowing = true;
    },
    hideNotification() {
        self.isNotificationShowing = false;
    },
    setIsRegisterShowing(value: boolean) {
        self.isRegisterShowing = value;
    }
}));

const DEFAULT = {
    loading: false,
    api: null,
    contractAddress: "n232Nw7xgGgYwz99N3TvGruqLw8A6k2spgf",
    nebState: null,
    nebPay: null,
    notification: "",
    isRegisterShowing: false,
    isNotificationShowing: false
};

export { SiteState as Model, DEFAULT }