import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@material-ui/core";
import {FormattedMessage} from 'react-intl';
import {ChangeEvent} from "react";
import store from "../stores";


// var NebPay = require("nebpay.js");

interface State {
    content: string,
    file: any,
    imagePreviewUrl: string
}

interface Props {
    isOpen: boolean,
    onClose: React.EventHandler<any>,
    onCompleted: React.EventHandler<any>
}

export default class NewPost extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            content: '',
            file: null,
            imagePreviewUrl: ''
        }
    }

    updateContent(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            content: e.target.value
        })
    }

    confirm() {

        if (this.state.content === null || this.state.content.length == 0) {
            return;
        }


        store.siteState.setLoading(true);

        if (this.state.file) {
            const apiURL = "https://ipfs.infura.io:5001/api/v0/";
            const FD = new FormData();
            FD.append('file', this.state.file, this.state.file.name);

            fetch(apiURL + "add", { method: "post", body: FD })
                .then(r => r.json())
                .then(data => {
                    this.upload(data.Hash);
                    //window.open("https://ipfs.infura.io/ipfs/" + data.Hash + "?dl=1");
                })
                .catch(err => {
                    store.siteState.setLoading(false);
                    store.siteState.sendNotification("网络异常，请稍后再试。");
                })
        } else {
            this.upload(null);
        }

    }

    upload(media: any) {


        store.siteState.setLoading(true);
        var to = store.siteState.contractAddress;
        var value = "0";
        var callFunction = "post";
        var callArgs =  JSON.stringify([{
            media: media,
            content: this.state.content,
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
                _this.props.onCompleted({
                    media: media,
                    content: _this.state.content,
                    author: {
                        name: store.user.model.name,
                        email: store.user.model.email
                    }
                });
                _this.close();
            }
        };
        store.siteState.nebPay.call(to, value, callFunction, callArgs, options);

        // this.props.onCompleted({
        //     media: media,
        //     content: this.state.content,
        //     author: {
        //         name: store.user.model.name,
        //         email: store.user.model.email
        //     }
        // });
        // store.siteState.setLoading(false);
        // this.close();
    }

    close() {
        this.setState({
            content: '',
            file: null,
            imagePreviewUrl: ''
        });
        this.props.onClose(null);
    }

    addImage(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        if (e.target.files) {


            let reader = new FileReader();
            let file = e.target.files[0];

            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            };

            reader.readAsDataURL(file)

        }
    }

    private removeImage() {
        this.setState({
            file: null,
            imagePreviewUrl: ''
        })
    }

    render() {
        return(

            <Dialog
                fullWidth
                open={this.props.isOpen}>
                <DialogTitle>
                    <FormattedMessage id="send_post"/>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        multiline
                        autoFocus
                        margin="dense"
                        fullWidth
                        label={<FormattedMessage id="post_content"/>}
                        onChange={this.updateContent.bind(this)}/>
                    <img className="image-preview" src={this.state.imagePreviewUrl}/>
                    {!this.state.file &&
                        <div>
                            <Button color="primary">
                                <label htmlFor="file-upload">
                                    <FormattedMessage id="upload_image"/>
                                </label>
                            </Button>
                            <input onChange={this.addImage.bind(this)} type="file" accept="image/*" id="file-upload" style={{display: "none"}}
                                   ref="filepicker">
                            </input>
                        </div>
                    }
                    {this.state.file &&
                        <div>
                            <Button onClick={this.removeImage.bind(this)} color="primary">
                                <FormattedMessage id="remove_image"/>
                            </Button>
                        </div>
                    }
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
        )
    }

}