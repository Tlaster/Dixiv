import * as React from "react";
import {ChangeEvent} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
import {FormattedMessage} from 'react-intl';
import store from "../stores";
// var NebPay = require("nebpay.js");

interface State {
    name: string,
    email: string,
}

interface Props {
    isOpen: boolean
    onCompleted: React.EventHandler<any>
    onClose: React.EventHandler<any>
}

export default class InputUserInfo extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
    }

    confirm() {

        if (this.state.name === null || this.state.email === null || this.state.name.length < 3 || this.state.email.length < 3) {
            return;
        }

        // store.user.update({
        //     name: this.state.name,
        //     email: this.state.email
        // });
        // this.close();


        store.siteState.setLoading(true);
        var to = store.siteState.contractAddress;
        var value = "0";
        var callFunction = "setUser";
        var callArgs =  JSON.stringify([{
            name: this.state.name,
            email: this.state.email,
        }]);
        var _this = this;
        var options = {
            qrcode: {
                showQRCode: false,      //是否显示二维码信息
                container: undefined,    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
                completeTip: undefined, // 完成支付提示
                cancelTip: undefined // 取消支付提示
            },

            listener: function (value: any) {
                store.siteState.setLoading(false);

                if (typeof value == 'string') {
                    store.siteState.sendNotification("用户取消了支付！");
                    return
                }

                store.user.update({
                    name: _this.state.name,
                    email: _this.state.email
                });

                _this.props.onCompleted({
                    name: _this.state.name,
                    email: _this.state.email
                });
            }
        };
        store.siteState.nebPay.call(to, value, callFunction, callArgs, options);
    }

    updateName(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.target.value
        })
    }

    updateEmail(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            email: e.target.value
        })
    }

    close() {
        this.props.onClose(null);
    }

    render() {
        return (
            <Dialog
                fullWidth
                open={this.props.isOpen}>
                <DialogTitle>
                    <FormattedMessage id="input_user_name"/>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id="input_user_name_desc"/>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        label={<FormattedMessage id="user_name"/>}
                        onChange={this.updateName.bind(this)}/>
                    <TextField
                        margin="dense"
                        fullWidth
                        label={<FormattedMessage id="user_email"/>}
                        onChange={this.updateEmail.bind(this)}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.confirm.bind(this)} color="primary">
                        <FormattedMessage id="confirm"/>
                    </Button>
                    <Button onClick={this.close.bind(this)} color="primary">
                        <FormattedMessage id="cancel"/>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}