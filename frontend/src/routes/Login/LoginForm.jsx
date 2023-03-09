import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import logoImg from "./ISULogo.png";

import DataStore from '../../utilities/data/DataStore';
import UserAPI from '../../utilities/api/UserAPI';

import { Navigate } from "react-router-dom";


import LocalUser from '../../utilities/model/LocalUser';


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            netid: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 30) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            netid: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doSignUpNaviation() {
		window.location.pathname = "/signup";
	}

    async doLogin() {
        if(!this.state.netid){
            return;
        }
        if(!this.state.password){
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {

            const res = await LocalUser.login(this.state.netid, this.state.password);
            if (!res) { // (invalid credentials)
                this.resetForm();
            }
            console.log(res);
        }

        catch(e) {
            this.resetForm();
        }
    }
    
    render() {
        return (
            <div className="loginForm">
                <div className="login-logo-container">
				    <img className="login-logo" src={logoImg} />
			    </div>
                <div className="username-container">
                    <InputField
                       type="text"
                       placeholder="Username"
                       value={this.state.netid ? this.state.netid : ''}
                       onChange={ (val) => this.setInputValue('netid', val) }
                    />
                </div>
                <div className="password-container">
                    <InputField
                    type="password"
                    placeholder="Password"
                    value={this.state.password ? this.state.password : ''}
                    onChange={ (val) => this.setInputValue('password', val) }
                    />
                </div>
                <div className="forgotpassword-container">
                    <a className="forgotPassword" href="">Forgot password?</a>
                </div>
                    <SubmitButton
                    text="Sign in"
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doLogin() }
                    />
                    <SubmitButton
                    text="Sign Up"
                    disabled={false}
                    onClick={ () => this.doSignUpNaviation() }
                    />
            </div>
        );
    }
}

export default LoginForm;