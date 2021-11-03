import React, {useState} from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updatePasswordApi } from '../../../api/user';

export default function ChangePasswordForm(props) {
    const {user, logout}=props;
    const [loading, setLoading] = useState(false);

    const formik=useFormik({
        initialValues:initialValues(user.password, logout),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:async(formData)=>{
            setLoading(true);
            const response= await updatePasswordApi(user.id, formData, logout);

            if(!response){
                toast.error('Error al actualizar su contraseña', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                logout();
            }
            setLoading(false);
        }
    });

    return (
        <div className='change-name-form'>
            <h4>Cambia tu contraseña</h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths='equal'>
                    <Form.Input
                        name='password'
                        type='password' 
                        placeholder='Nueva Contraseña'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        error={formik.errors.password}
                    />
                    <Form.Input 
                        name='repeatPassword'
                        type='password' 
                        placeholder='Repita Contraseña'
                        onChange={formik.handleChange}
                        value={formik.values.repeatPassword}
                        error={formik.errors.repeatPassword}
                    />
                </Form.Group>

                
                    <Button color='orange' type='submit' loading={loading}>
                        <Icon name='edit'/>Editar
                    </Button>
            </Form>
        </div>
    )
};

function initialValues(password, repeatPassword){
    return{
        password:'',
        repeatPassword:''
    }
};

function validationSchema(){
    return{
        password:Yup.string().required(true).oneOf([Yup.ref('repeatPassword')],true),
        repeatPassword:Yup.string().required(true).oneOf([Yup.ref('password')],true),
    }
};
