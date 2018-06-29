import * as React from "react";
import {Card, CardColumns} from "reactstrap"
import store from "../../stores";
import {PostItem} from "./PostItem";
import './index.css';
import {FormattedMessage} from 'react-intl';
import {Typography} from "@material-ui/core";

interface State {
    items: any[],
    max_id: number
}

interface Props {

}

export default class Posts extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            items: [],
            max_id: 0
        };
    }

    componentDidMount() {
    }

    public insert(item: any) {
        let list = this.state.items;
        list.push(item);
        this.setState({
            items: list
        });
    }

    public load() {
        var _this = this;
        store.siteState.api.call({
            chainID: store.siteState.nebState.chain_id,
            from: store.user.address,
            to: store.siteState.contractAddress,
            value: 0,
            // nonce: nonce,
            gasPrice: 1000000,
            gasLimit: 2000000,
            contract: {
                function: "timeline",
                args: JSON.stringify([0, 20])
            },
        }).then(function (resp: any) {
            if (resp && resp.result) {
                var result = JSON.parse(resp.result);
                if (result) {
                    _this.setState({
                        max_id: result.max_id,
                        items: result.result
                    })
                }
            }
        });
    }

    render() {
        return(
            <div>
                {this.state.items.length <= 0 &&
                <Typography >
                    <FormattedMessage id="empty_posts"/>
                </Typography>}
                {this.state.items.length > 0 &&
                <CardColumns className="post-container">
                    {this.state.items.map((value, index) => (<Card key={index}><PostItem dataContext={value} /></Card>))}
                </CardColumns>
                }
            </div>
        );
    }
}