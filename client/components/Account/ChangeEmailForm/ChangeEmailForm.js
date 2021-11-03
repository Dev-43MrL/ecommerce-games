import React, {useState} from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updateEmailApi } from '../../../api/user';


export default function ChangeEmailForm(props) {
    const {user, logout, setReloadUser}=props;
    const [loading, setLoading] = useState(false);

    const formik=useFormik({
        initialValues:initialValues(user.email),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:async(formData)=>{
            setLoading(true);
            const response= await updateEmailApi(user.id, formData, logout);

            if(!response || response?.statusCode === 400){
                toast.error('Error al actualizar su email', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                toast.success('Email actualizado', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setReloadUser(true);
            }
            setLoading(false);
        }
    });

    return (
        <div className='change-email-form'>
            <h4>Cambia tu e-mail </h4>
            <span>Tu e-mail actual es: {user.email}</span>

            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths='equal'>
                    <Form.Input 
                        name='email' 
                        placeholder='Nuevo Email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        error={formik.errors.email}
                    />
                    
                </Form.Group>

                
                    <Button color='orange' type='submit' loading={loading}>
                        <Icon name='edit'/>Editar
                    </Button>
            </Form>
        </div>
    )
};

function initialValues(email){
    return{
        email:email || ''
    }
};

function validationSchema(){
    return{
        email:Yup.string().email().required(true),
    }
};
