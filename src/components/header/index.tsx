import './index.css';
import * as React from 'react';
import {observer} from "mobx-react";
import {AppBar, Avatar, Button, Toolbar, Typography} from "@material-ui/core";
import * as Gravatar from "react-gravatar";
import store from "../../stores";
import {FormattedMessage} from 'react-intl';

interface State {
    isOpen: boolean
}

@observer
export default class Header extends React.Component<any, State> {


    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    public toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    private showRegister() {
        store.siteState.setIsRegisterShowing(true);
    }

    public render() {
        return(
            <AppBar position="static">
                <Toolbar>
                    <Typography className="flex" variant="title" color="inherit">
                        <FormattedMessage id="app_name"/>
                    </Typography>
                    {store.user.model &&
                    <div className="menu-right">
                        <Avatar>
                            <Gravatar email={store.user.model.email} />
                        </Avatar>
                    </div>
                    }
                    {!store.user.model &&
                    <div className="menu-right">
                        <Button onClick={this.showRegister.bind(this)} color="inherit">
                            <FormattedMessage id="register"/>
                        </Button>
                    </div>
                    }
                </Toolbar>
            </AppBar>
        );
    }
}