import * as React from "react";
import * as Gravatar from "react-gravatar";
import {Avatar, Card, CardContent, Chip} from "@material-ui/core";
import {CardImg, CardTitle} from "reactstrap";

interface State {

}

interface Props {
    dataContext: any
}

export class PostItem extends React.Component<Props, State> {
    render() {
        return(
            <Card>
                {this.props.dataContext.media &&
                    <CardImg top width="100%" src={"https://ipfs.infura.io/ipfs/" + this.props.dataContext.media} alt="Card image cap"/>
                }
                <CardContent>
                    <CardTitle>{this.props.dataContext.content}</CardTitle>
                    <Chip
                        avatar={
                            <Avatar>
                                <Gravatar email={this.props.dataContext.author.email} />
                            </Avatar>}
                        label={this.props.dataContext.author.name}
                    />
                </CardContent>
            </Card>
        )
    }
}