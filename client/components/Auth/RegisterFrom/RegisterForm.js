import React, {useState} from 'react';
import {Form, Button} from 'semantic-ui-react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {registerApi} from '../../../api/user';
import {toast} from 'react-toastify';

export default function RegisterForm(props) {
    const {showLoginForm}=props;
    const [loading, setLoading] = useState(false);

    const formik= useFormik({
        initialValues:initialValues(),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:async(formData)=>{
            setLoading(true);
            const response= await registerApi(formData);
            
            if(response?.jwt) {
                toast.success('Registro Correcto');
                showLoginForm();
            }else{
                toast.error('Registro ya existe');
            }

            setLoading(false);
        },
    });

    return (
        <Form className='login-form' onSubmit={formik.handleSubmit}>
            <Form.Input 
                name='name' 
                type='text' 
                placeholder='Su Nombre' 
                onChange={formik.handleChange}
                error={formik.errors.name}
            />
            <Form.Input 
                name='lastname' 
                type='text' 
                placeholder='Su Apellido' 
                onChange={formik.handleChange}
                error={formik.errors.lastname}
            />
            <Form.Input 
                name='username' 
                type='text' 
                placeholder='Su Nombre Usuario' 
                onChange={formik.handleChange}
                error={formik.errors.username}
            />
            <Form.Input 
                name='email' 
                type='text' 
                placeholder='Su Email' 
                onChange={formik.handleChange}
                error={formik.errors.email}
            />
            <Form.Input 
                name='password' 
                type='password' 
                placeholder='Su Contraseña' 
                onChange={formik.handleChange}
                error={formik.errors.password}
            />
            <div className='actions'>
                <Button onClick={showLoginForm} color='blue'>
                    Iniciar Sesion
                </Button>
                <Button type='submit' color='orange' loading={loading}>
                    Registrarse
                </Button>
            </div>
        </Form>
    )
}

// Etado inical del formulario
function initialValues(){
    return{
        name:'',
        lastname:'',
        username:'',
        email:'',
        password:''
    }
}

//Validaciones con Yup
function validationSchema(){
    return{
        name:Yup.string().required(true),
        lastname:Yup.string().required(true),
        username:Yup.string().required(true),
        email:Yup.string().email(true).required(true),
        password:Yup.string().required(true),
    }
}