import React, { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

import LocalUser from '../../utilities/model/LocalUser';

import { showErrorToast } from "../../components/Toast";

import InputField from './InputField';
import SubmitButton from './SubmitButton';
import logoImg from "./ISULogo.png";

const DEFAULT_INPUT_STATE = {
    netid: '',
    password: '',
    buttonDisabled: false
};

function LoginForm(props) {

    // Hooks
    const [inputState, setInputState] = useState(DEFAULT_INPUT_STATE);
    const navigate = useNavigate();

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
    const doLogin = async () => {
        if(!inputState.netid){
            return;
        }
        if(!inputState.password){
            return;
        }

        setInputState({
            ...inputState,
            buttonDisabled: true
        });

        try {
            const res = await LocalUser.login(inputState.netid, inputState.password);
            if (res) {
                navigate("/home");
            } else { // (invalid credentials)
                console.log("hi");
                showErrorToast("Invalid credentials");
                resetForm();
            }
            console.log(res);
        }
        catch(e) {
            showErrorToast("Invalid credentials");
            resetForm();
        }
    }
    
    return (
        <div className="loginForm">
            <div className="login-logo-container">
                <img className="login-logo" src={logoImg} />
            </div>
            <div className="username-container">
                <InputField
                    type="text"
                    placeholder="Username"
                    value={inputState.netid ? inputState.netid : ''}
                    onChange={ (val) => setInputValue('netid', val) }
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
            {/* <div className="forgotpassword-container">
                <a className="forgotPassword" href="">Forgot password?</a>
            </div> */}
                <SubmitButton
                text="Sign in"
                disabled={inputState.buttonDisabled}
                onClick={doLogin}
                />
                <SubmitButton
                text="Sign Up"
                disabled={false}
                onClick={ () => navigate("/signup") }
                />
        </div>
    );

}

export default LoginForm;