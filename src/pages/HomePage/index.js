import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/cabecalho'
import NavMenu from '../../components/navmenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      novoTweet: '',
      tweets: []
    }
  }

  adicionaTweet = (infosDoEvento) => {
    infosDoEvento.preventDefault();

    const key = localStorage.getItem('TOKEN');

    if (this.state.novoTweet.length > 0) {
      fetch(`https://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${key}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ conteudo: this.state.novoTweet})
      })
        .then(response => {
          return response.json();
        })
        .then(tweetVindoServer => {
          this.setState({
            tweets: [tweetVindoServer, ...this.state.tweets]
          });
        })

        console.log(this.state.tweets);
    }

    
  }

  render() {
    const { novoTweet } = this.state;
    console.log(this.state.tweets);

    return (
      <Fragment>
        <Cabecalho>
          <NavMenu usuario="@omariosouto" />
        </Cabecalho>
        <div className="container">
          <Dashboard>
            <Widget>
              <form className="novoTweet">
                <div className="novoTweet__editorArea">
                  <span className={
                    `novoTweet__status
                    ${
                    this.state.novoTweet.length > 140
                      ? 'novoTweet__status--invalido'
                      : ''
                    }
                    `
                  }>{novoTweet.length}/140</span>
                  <textarea
                    className="novoTweet__editor"
                    placeholder="O que está acontecendo?"
                    value={this.state.novoTweet}
                    onChange={event => this.setState({ novoTweet: event.target.value })}></textarea>
                </div>
                <button
                  type="submit"
                  className="novoTweet__envia"
                  onClick={this.adicionaTweet}
                  disabled={novoTweet.length === 0 || novoTweet.length > 140}>Tweetar</button>
              </form>
            </Widget>
            <Widget>
              <TrendsArea />
            </Widget>
          </Dashboard>
          <Dashboard posicao="centro">
            <Widget>
              <div className="tweetsArea">
                {this.state.tweets.map((tweetInfo, index) => {
                  return (
                    <Tweet
                      key={tweetInfo._id}
                      texto={tweetInfo.conteudo}
                      usuario={tweetInfo.usuario}
                    />
                  )
                })}
              </div>
            </Widget>
          </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;