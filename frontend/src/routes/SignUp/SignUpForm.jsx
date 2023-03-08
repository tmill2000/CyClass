import React from 'react';
import InputField from '../Login/InputField';
import SubmitButton from '../Login/SubmitButton';
import logoImg from "../Login/ISULogo.png";

import DataStore from '../../utilities/data/DataStore';
import UserAPI from '../../utilities/api/UserAPI';

const userAPI = new UserAPI();

import './style.css';

class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            netid: '',
            password: '',
            confirmpassword: '',
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
            firstname: '',
            lastname:'',
            netid: '',
            password: '',
            confirmpassword: '',
            buttonDisabled: false
        })
    }

    async doSignup() {
        if(!this.state.firstname){
            return;
        }
        if(!this.state.lastname){
            return;
        }
        if(!this.state.netid){
            return;
        }
        if(!this.state.password){
            return;
        }
        if(!this.state.confirmpassword){
            return;
        }
        if (!(this.state.password === this.state.confirmpassword)){
            return;
        }
        
        this.setState({
            buttonDisabled: true
        })

        try {

            const res = await userAPI.signup(this.state.netid, this.state.password, this.state.firstname, this.state.lastname);
            if(res.accepted) {
                const res_login = await userAPI.login(this.state.netid, this.state.password);
                DataStore.set("netID", this.state.netid);
                DataStore.set("userID", res_login.userID);
                DataStore.set("sessionID", res_login.sessionID);
                DataStore.set("courses", JSON.stringify(res_login.courses));
            } else {
                this.resetForm();
                alert(result.msg);
            }
            console.log(res.accepted);
        }

        catch(e) {
            this.resetForm();
        }
    }
    
    render() {
        return (
            <div className="signup-Form">
                <div className="signup-logo-container">
				    <img className="signup-logo" src={logoImg} />
			    </div>
                <div className="username-container">
                    <InputField
                       type="text"
                       placeholder="Username"
                       value={this.state.netid ? this.state.netid : ''}
                       onChange={ (val) => this.setInputValue('netid', val) }
                    />
                </div>
                <div className="username-container">
                    <InputField
                       type="text"
                       placeholder="First Name"
                       value={this.state.firstname ? this.state.firstname : ''}
                       onChange={ (val) => this.setInputValue('firstname', val) }
                    />
                </div>
                <div className="username-container">
                    <InputField
                       type="text"
                       placeholder="Last Name"
                       value={this.state.lastname ? this.state.lastname : ''}
                       onChange={ (val) => this.setInputValue('lastname', val) }
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
                <div className="password-container">
                    <InputField
                    type="password"
                    placeholder="Confirm Password"
                    value={this.state.confirmpassword ? this.state.confirmpassword : ''}
                    onChange={ (val) => this.setInputValue('confirmpassword', val) }
                    />
                </div>
                    <SubmitButton
                    text="Sign Up"
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doSignup() }
                    />
            </div>
        );
    }
}

export default SignUpForm;