import React, {useState} from 'react';
import {Form, Button} from 'semantic-ui-react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {loginApi, resetPasswordApi} from '../../../api/user';
import {toast} from 'react-toastify';
import useAuth from '../../../hooks/useAuth';

export default function loginForm(props) {

    const {showRegisterForm, onCloseModal}=props;
    const [loading, setLoading] = useState(false);
    const {login} =useAuth();
    
    const formik=useFormik({
        initialValues:initialValues(),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:async(formData)=>{
            
            setLoading(true);

            const response= await(loginApi(formData));

            if(response?.token){
                onCloseModal();
                login(response.token),
                toast.success('Bienvenido', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                toast.error('Email o Contraseña incorrectos', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
            setLoading(false);
        },
    });

    const resetPassword=()=>{
        formik.setErrors({});
        const validateEmail=Yup.string().email().required();

        if(!validateEmail.isValidSync(formik.values.identifier)){
            formik.setErrors({email:true});
        }else{
            resetPasswordApi(formik.values.identifier);
        }
    }

    return (
        <Form className='login-form' onSubmit={formik.handleSubmit}>
            <Form.Input
                name='email'
                type='text'
                placeholder='Correo Electronico'
                onChange={formik.handleChange}
                error={formik.errors.identifier}
            />
            <Form.Input 
                name='password'
                type='password'
                placeholder='Contraseña'
                onChange={formik.handleChange}
                error={formik.errors.password}
            />

            <div className='actions'>
                <Button.Group>
                    <Button type='submit' color='blue' className='submit' loading={loading}>
                        Entrar
                    </Button>
                    <Button.Or />
                    <Button type='button' color='orange' onClick={showRegisterForm}>
                        Registrarse
                    </Button>
                    {/* <Button.Or />
                    <Button type='button' color='yellow' onClick={resetPassword}>
                        ¿Has olvidado la contraseña?
                    </Button> */}
                </Button.Group>
            </div>
        </Form>
    )
}

function initialValues(){
    return{
        email:'',
        password:''
    }
}

function validationSchema(){
    return{
        email:Yup.string().email(true).required(true),
        password:Yup.string().required(true),
    }
}
