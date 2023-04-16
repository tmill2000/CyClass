import React, { useState } from 'react';
import InputField from '../Login/InputField';
import SubmitButton from '../Login/SubmitButton';
import logoImg from "../Login/ISULogo.png";

import LocalUser from '../../utilities/model/LocalUser';
import UserAPI from '../../utilities/api/UserAPI';

const userAPI = new UserAPI();

import './style.css';

const DEFAULT_INPUT_STATE = {
    firstname: '',
    lastname: '',
    netid: '',
    password: '',
    confirmpassword: '',
    buttonDisabled: false
};

function SignUpForm(props) {

    // State
    const [inputState, setInputState] = useState(DEFAULT_INPUT_STATE);

    // Helper functions
    const setInputValue = (property, val) => {
        val = val.trim();
        if (val.length > 30) {
            return;
        }
        setInputState({
            ...inputState,
            [property]: val
        })
    };
    const resetForm = () => {
        setInputState(DEFAULT_INPUT_STATE);
    }
    const doSignup = async () => {
        if(!inputState.firstname){
            return;
        }
        if(!inputState.lastname){
            return;
        }
        if(!inputState.netid){
            return;
        }
        if(!inputState.password){
            return;
        }
        if(!inputState.confirmpassword){
            return;
        }
        if (!(inputState.password === inputState.confirmpassword)){
            return;
        }
        
        setInputState({
            ...inputState,
            buttonDisabled: true
        });

        try {

            const res = await userAPI.signup(inputState.netid, inputState.password, inputState.firstname, inputState.lastname);
            console.log("Sign-up success?", res.accepted);
            if(res.accepted) {
                const loginRes = await LocalUser.login(inputState.netid, inputState.password);
                console.log("Login success?", loginRes);
            } else {
                resetForm();
                alert(result.msg);
            }
        }
        catch(e) {
            resetForm();
        }
    }

    return (
        <div className="signup-Form">
            {/* <img className="signup-logo" src={logoImg} style="width: 100px;"/> */}
            <div className="username-container">
                <InputField
                   type="text"
                   placeholder="Username"
                   value={inputState.netid ? inputState.netid : ''}
                   onChange={ (val) => setInputValue('netid', val) }
                />
            </div>
            <div className="username-container">
                <InputField
                   type="text"
                   placeholder="First Name"
                   value={inputState.firstname ? inputState.firstname : ''}
                   onChange={ (val) => setInputValue('firstname', val) }
                />
            </div>
            <div className="username-container">
                <InputField
                   type="text"
                   placeholder="Last Name"
                   value={inputState.lastname ? inputState.lastname : ''}
                   onChange={ (val) => setInputValue('lastname', val) }
                />
            </div>
            <div className="password-container">
                <InputField
                type="password"
                placeholder="Password"
                value={inputState.password ? inputState.password : ''}
                onChange={ (val) => setInputValue('password', val) }
                />
            </div>
            <div className="password-container">
                <InputField
                type="password"
                placeholder="Confirm Password"
                value={inputState.confirmpassword ? inputState.confirmpassword : ''}
                onChange={ (val) => setInputValue('confirmpassword', val) }
                />
            </div>
                <SubmitButton
                text="Sign Up"
                disabled={inputState.buttonDisabled}
                onClick={doSignup}
                />
        </div>
    );

}

export default SignUpForm;