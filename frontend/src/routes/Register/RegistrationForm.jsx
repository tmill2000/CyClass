import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import logoImg from "./ISULogo.png";
import axios from "axios";


class RegistrationForm extends React.Component {

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

    async doRegister() {
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
            await axios.post('/api/user/addUser', {
                netId: this.state.netid,
                password: this.state.password 
            });
            history.push("/");
        } catch(e) {
            this.resetForm();
        }
    }
    
    render() {
        return (
            <div className="registrationForm">
                <div className="registration-logo-container">
				    <img className="registration-logo" src={logoImg} />
			    </div>
                <div className="text">
                <p>
                    Please enter your credentials below:
                </p>
                </div>
                <div className="username-container">
                    <InputField
                       type="text"
                       placeholder="Net ID"
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
                    <SubmitButton
                    text="Create Account"
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doRegister() }
                    />
            </div>
        );
    }
}

export default RegistrationForm;