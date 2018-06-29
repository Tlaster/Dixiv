import * as React from "react";
import {CircularProgress, Dialog} from "@material-ui/core";
import {observer} from "mobx-react";
import store from "../stores";

@observer
export default class Loading extends React.Component {
    render() {
        return(
            <Dialog open={store.siteState.loading}>
                <CircularProgress />
            </Dialog>
        );
    }
}