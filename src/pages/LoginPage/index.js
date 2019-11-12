import React, { Component, Fragment } from 'react'
import { NotificacaoContext } from '../../context/NotificacaoContext'
import { LoginService } from '../../services/LoginService'
import Cabecalho from '../../components/cabecalho'
import Widget from '../../components/Widget'
import InputFormField from '../../components/InputFormField';
import FormManager from '../../components/FormManager';

import './loginPage.css'

class LoginPage extends Component {
    static contextType = NotificacaoContext

    constructor() {
        super();
        this.state = {
            error: ''
        }
    }

    fazerLogin = (infosDoEvento, values) => {
        infosDoEvento.preventDefault();

        const dadosDeLogin = {
            login: values.inputLogin,
            senha: values.inputSenha
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
                            <FormManager
                                initialValues={{ inputLogin: '', inputSenha: '' }}
                                onFormValidation={values => {
                                    const errors = {};
                                    if (!values.inputLogin) errors.inputLogin = 'Esse campo é obrigatório';
                                    if (!values.inputSenha) errors.inputSenha = 'Esse campo é obrigatório';

                                    return errors
                                }}>

                                {
                                    ({
                                        values,
                                        errors,
                                        touched,
                                        onFormFieldChange,
                                        onFormFieldBlur
                                    }) => (
                                            <form
                                                className="loginPage__form"
                                                action="/"
                                                onSubmit={(event) => this.fazerLogin(event, values)}>
                                                <InputFormField
                                                    id='inputLogin'
                                                    label='Login: '
                                                    onChange={onFormFieldChange}
                                                    values={values}
                                                    errors={errors}
                                                    onBlur={onFormFieldBlur}
                                                    touched={touched}
                                                />

                                                <InputFormField
                                                    id='inputSenha'
                                                    label='Senha: '
                                                    onChange={onFormFieldChange}
                                                    values={values}
                                                    errors={errors}
                                                    onBlur={onFormFieldBlur}
                                                    touched={touched}
                                                />

                                                {this.state.error && (
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
                                        )
                                }
                            </FormManager>
                        </Widget>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default LoginPage