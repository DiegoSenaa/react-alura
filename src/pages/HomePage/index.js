import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import Cabecalho from '../../components/cabecalho';
import NavMenu from '../../components/navmenu';
import Dashboard from '../../components/Dashboard';
import Widget from '../../components/Widget';
import TrendsArea from '../../components/TrendsArea';
import Tweet from '../../components/Tweet';
import Modal from '../../components/Modal';

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      novoTweet: '',
      tweets: [],
      tweetAtivoNoModal: {}
    }
  }

  abreModal = tweetQueVaiProModal => {
    this.setState({
      tweetAtivoNoModal: tweetQueVaiProModal
    })
  }

  fechaModal = () => {
    this.setState({
      tweetAtivoNoModal: {}
    })
  }

  componentDidMount() {
    const token = localStorage.getItem('TOKEN');
    fetch(`https://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${token}`)
      .then(response => response.json())
      .then(tweets => {
        this.setState({ tweets })
      })
  }

  removeTweet(idTweetQueVaiSerRemovido) {
    const token = localStorage.getItem('TOKEN');
    fetch(`https://twitelum-api.herokuapp.com/tweets/${idTweetQueVaiSerRemovido}?X-AUTH-TOKEN=${token}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        const listaDeTweetsAtualizada = this.state.tweets.filter(tweet => tweet._id !== idTweetQueVaiSerRemovido);
        this.setState({
          tweets: listaDeTweetsAtualizada
        })
        this.fechaModal();
      })
  }

  adicionaTweet = (infosDoEvento) => {
    infosDoEvento.preventDefault();
    if(this.state.novoTweet.length > 0) {
      const token = localStorage.getItem('TOKEN');

      fetch(`https://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conteudo: this.state.novoTweet,
          login: 'omariosouto'
        })
      })
      .then(respostaDoServer => {
        return respostaDoServer.json()
      })
      .then((tweetDoServidor) => {
        this.setState({
          tweets: [tweetDoServidor, ...this.state.tweets],
          novoTweet: ''
        });
      })
    }
  }

  render() {
    const {novoTweet} = this.state;
    
    return (
      <Fragment>
        <Helmet>
          <title>Twitelum - ({`${this.state.tweets.length}`})</title>
        </Helmet>
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
                            this.state.novoTweet.length	>	140
                            ?	'novoTweet__status--invalido'
                            :	''
                    }
                    `
                }>{novoTweet.length}/140</span>
                <textarea 
                  className="novoTweet__editor" 
                  placeholder="O que está acontecendo?"
                  value={this.state.novoTweet}
                  onChange={ event => this.setState({novoTweet: event.target.value}) }></textarea>
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
                      id={tweetInfo._id}
                      texto={tweetInfo.conteudo}
                      usuario={tweetInfo.usuario}
                      likeado={tweetInfo.likeado}
                      totalLikes={tweetInfo.totalLikes}
                      removivel={tweetInfo.removivel}
                      removeHandler={event => this.removeTweet(tweetInfo._id)}
                      onClickNaAreaDeConteudo={() => this.abreModal(tweetInfo)}
                    />
                  )
                })}
              </div>
            </Widget>
          </Dashboard>
        </div>
        <Modal
          isAberto={Boolean(this.state.tweetAtivoNoModal._id)}
          onFechando={this.fechaModal}
        >
          {() => (
            <Tweet
              key={this.state.tweetAtivoNoModal._id}
              id={this.state.tweetAtivoNoModal._id}
              texto={this.state.tweetAtivoNoModal.conteudo}
              usuario={this.state.tweetAtivoNoModal.usuario}
              likeado={this.state.tweetAtivoNoModal.likeado}
              totalLikes={this.state.tweetAtivoNoModal.totalLikes}
              removivel={this.state.tweetAtivoNoModal.removivel}
              removeHandler={event => this.removeTweet(this.state.tweetAtivoNoModal._id)}
            />
          )}
        </Modal>
      </Fragment>
    );
  }
}

export default HomePage;