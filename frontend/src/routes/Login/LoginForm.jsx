import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import logoImg from "./ISULogo.png";

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

            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    netId: this.state.netid,
                    password: this.state.password 
                })
            });
            const result = await res.json();
            if(result?.sessionId) {
                UserStore.isLoggedIn = true;
                UserStore.netid = result.netid;
            }

            else if(result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }
            console.log(UserStore.isLoggedIn);
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
            </div>
        );
    }
}

export default LoginForm;