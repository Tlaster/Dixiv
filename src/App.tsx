import * as React from 'react';
import './App.css';
import Header from "./components/header";
import {Neb, HttpRequest} from 'nebulas'
import store from "./stores";
import InputUserInfo from "./components/InputUserInfo";
import Loading from "./components/Loading";
import {Button, Icon, Snackbar} from "@material-ui/core";
import {observer} from "mobx-react";
import Posts from "./components/posts";
import NewPost from "./components/NewPost";

var NebPay = require("nebpay.js");

interface State {
    isNewPostShown: boolean,
}

interface Props {

}

@observer
class App extends React.Component<Props, State> {
    posts: Posts | null;
    constructor(props: any) {
        super(props);

        this.state ={
            isNewPostShown: false
        };

        store.siteState.setLoading(true);

        const neb = new Neb();

        neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));
        const api = neb.api;
        store.siteState.setApi(api);
        store.siteState.setNebPay(new NebPay());
        api.getNebState().then((state: any) => {
            store.siteState.setNebState(state);
            window.addEventListener('message', (e) => {
                if (e.data && e.data.data && e.data.data.account) {
                    store.user.updateAddr(e.data.data.account);


                    store.siteState.api.call({
                        chainID: store.siteState.nebState.chain_id,
                        from: store.user.address,
                        to: store.siteState.contractAddress,
                        value: 0,
                        // nonce: nonce,
                        gasPrice: 1000000,
                        gasLimit: 2000000,
                        contract: {
                            function: "getUser",
                            args: JSON.stringify([store.user.address])
                        },
                    }).then(function (resp: any) {
                        if (resp && resp.result) {
                            var result = JSON.parse(resp.result);
                            if (result) {
                                store.user.update(result);
                            } else {
                                store.siteState.setIsRegisterShowing(true);
                            }
                        } else {
                            store.siteState.setIsRegisterShowing(true);
                        }
                        store.siteState.setLoading(false);
                    }).catch((reason: any) => {
                        store.siteState.setLoading(false);
                        store.siteState.sendNotification("网络异常，请稍后再试。");
                    });
                }
            });
            window.postMessage({
                "data": {},
                "method": "getAccount",
                "target": "contentscript",
            }, "*");
        })
    }

    public render() {
        return (
            <div>
                <Header/>
                <Posts ref={(child) => { this.posts = child; }}/>


                <Button onClick={this.sendPost.bind(this)} className="fab" variant="fab" color="primary" aria-label="add">
                    <Icon>edit_icon</Icon>
                </Button>

                <NewPost onCompleted={this.onNewPostCompleted.bind(this)} isOpen={this.state.isNewPostShown} onClose={this.onNewPostClosed.bind(this)}/>

                <InputUserInfo onClose={this.onInputUserInfoClosed.bind(this)} onCompleted={this.inputUserInfoCompleted.bind(this)} isOpen={store.siteState.isRegisterShowing}/>
                <Loading/>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={store.siteState.isNotificationShowing}
                    autoHideDuration={6000}
                    onClose={this.hideNotification.bind(this)}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{store.siteState.notification}</span>}
                />

            </div>
        );
    }

    private onNewPostCompleted(item: any) {
        if (this.posts != null) {
            this.posts.insert(item);
        }
    }

    private onInputUserInfoClosed() {
        store.siteState.setIsRegisterShowing(false);
    }

    private onNewPostClosed() {
        this.setState({
            isNewPostShown: false
        })
    }

    private sendPost() {
        if (store.user.model == null || store.user.model.name == null) {
            store.siteState.sendNotification("请先注册");
            return;
        }

        this.setState({
            isNewPostShown: true
        })
    }

    private hideNotification() {
        store.siteState.hideNotification();
    }

    private inputUserInfoCompleted(value: any) {
        if (this.posts != null) {
            this.posts.load();
        }
    }
}

export default App;
