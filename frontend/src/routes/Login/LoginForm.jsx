import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import logoImg from "./ISULogo.png";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
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
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin() {
        if(!this.state.username){
            return;
        }
        if(!this.state.password){
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {

            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password 
                })
            });

            let result = await res.json();
            if(result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
            }

            else if(result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }

        }

        catch(e) {
            console.log(e);
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
                       value={this.state.username ? this.state.username : ''}
                       onChange={ (val) => this.setInputValue('username', val) }
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
            </div>
        );
    }
}

export default LoginForm;