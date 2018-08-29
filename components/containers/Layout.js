import React, { Component } from "react";
import { Container, Grid, Header } from "semantic-ui-react";
import Head from "next/head";
import Menu from "../menu/MainMenu";

export default class Layout extends Component {
  render() {
    //console.log('........ Layout.render() currentAccount ..........')
    //console.log(this.props.currentAccount)

    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
          />
        </Head>
        <br />
        <Header size="medium" content="Attendance Incentives" />
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Menu />
            </Grid.Column>
            <Grid.Column width={13}>{this.props.children}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
