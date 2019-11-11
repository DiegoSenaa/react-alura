import React, { Component, Fragment } from 'react'
import { NotificacaoContext } from '../../context/NotificacaoContext'
import { LoginService } from '../../services/LoginService'
import Cabecalho from '../../components/Cabecalho'
import Widget from '../../components/Widget'

import './loginPage.css'

class LoginPage extends Component {
    static contextType = NotificacaoContext

    constructor() {
        super();
        this.state = {
            error: ''
        }
    }

    fazerLogin = (infosDoEvento) => {
        infosDoEvento.preventDefault();

        const dadosDeLogin = {
            login: this.refs.inputLogin.value,
            senha: this.refs.inputSenha.value
        }

        LoginService.logar(dadosDeLogin)
            .then(() => {
                this.setState({ error: '' })
                this.context.setMsg('Bem vindo ao Twitelum, login foi um sucesso.');
                this.props.history.push('/')
            })
            .catch(err => {
                this.setState({ error: err.message })
                console.error(`[Erro ${err.status}]`, err.message)
            })
    }

    render() {
        return (
            <Fragment>
                <Cabecalho />
                <div className="loginPage">
                    <div className="container">
                        <Widget>
                            <h2 className="loginPage__title">Seja bem vindo!</h2>
                            <form className="loginPage__form" action="/" onSubmit={this.fazerLogin}>
                                <div className="loginPage__inputWrap">
                                    <label className="loginPage__label" htmlFor="login">Login</label> 
                                    <input ref="inputLogin" className="loginPage__input" type="text" id="login" name="login"/>
                                </div>
                                <div className="loginPage__inputWrap">
                                    <label className="loginPage__label" htmlFor="senha">Senha</label> 
                                    <input ref="inputSenha" className="loginPage__input" type="password" id="senha" name="senha"/>
                                </div>
                                { this.state.error && ( 
                                    <div className="loginPage__errorBox">
                                        {this.state.error}
                                    </div> 
                                )}
                                <div className="loginPage__inputWrap">
                                    <button className="loginPage__btnLogin" type="submit"> 
                                        Logar
                                    </button>
                                </div>
                            </form>
                        </Widget>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default LoginPage