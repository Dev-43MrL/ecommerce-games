import React, {useState} from 'react'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterFrom';

export default function Auth(props) {
    const {onCloseModal, setTitleModal}=props;
    const [showLogin, setShowLogin] = useState(true);

    const showLoginForm=()=>{
        setTitleModal("Iniciar Sesion");
        setShowLogin(true);
    }
    const showRegisterForm=()=>{
        setTitleModal("Registrese")
        setShowLogin(false);
    }

    return showLogin? (
        <LoginForm showRegisterForm={showRegisterForm} onCloseModal={onCloseModal}/>
    ):( 
        <RegisterForm showLoginForm={showLoginForm}/>
    );
}
