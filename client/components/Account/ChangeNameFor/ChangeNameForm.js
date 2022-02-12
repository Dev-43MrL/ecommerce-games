import React, {useState} from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updateNameApi } from '../../../api/user';

export default function ChangeNameForm(props) {
    const {user, logout, setReloadUser}=props;
    const [loading, setLoading] = useState(false);

    const formik=useFormik({
        initialValues:initialValues(user.name, user.lastname ),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:async(formData)=>{
            setLoading(true);
            const response= await updateNameApi(user.uid, formData, logout);

            if(!response){
                toast.error('Error al actualizar nombre y apellido', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                toast.success('Datos editados', {
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
        <div className='change-name-form'>
            <h4>Cambia tu nombre y apellido</h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths='equal'>
                    <Form.Input 
                        name='name' 
                        placeholder='Nuevos nombres'
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        error={formik.errors.name}
                    />
                    <Form.Input 
                        name='lastname' 
                        placeholder='Nuevos apellidos'
                        onChange={formik.handleChange}
                        value={formik.values.lastname}
                        error={formik.errors.lastname}
                    />
                </Form.Group>

                
                    <Button color='orange' type='submit' loading={loading}>
                        <Icon name='edit'/>Editar
                    </Button>
            </Form>
        </div>
    )
};

function initialValues(name, lastname){
    return{
        name:name || '',
        lastname:lastname || ''
    }
};

function validationSchema(){
    return{
        name:Yup.string().required(true),
        lastname:Yup.string().required(true),
    }
};
