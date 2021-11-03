import React,{useState} from 'react';
import { Form, Icon, Button } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { createAddressApi, updateAddressApi } from '../../../api/address';

export default function AddressForm(props){
    const [loading, setLoading]=useState(false);
    const {auth, logout}=useAuth();
    const {setShowModal, setReloadAddresses, newAddress, address}=props;

    const formik=useFormik({
        initialValues:initialValues(address),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:(formData)=>{
            
            newAddress
            ? createAddress(formData)
            : updateAddress(formData) 
        },
    });

    const createAddress= async(formData)=>{
        setLoading(true);
        const formDataTemp={
            ...formData,
            user:auth.idUser,
        };
        const response=await createAddressApi(formDataTemp, logout);
        
        if(!response){
            toast.error('Error al crear la direccion', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }else{
            toast.success('Direccion guardada', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            formik.resetForm();
            setReloadAddresses(true);
            setLoading(false);
            setShowModal(false);
        }
    }

    const updateAddress =async(formData)=>{
        setLoading(true);
        const formDataTemp={
            ...formData,
            user:auth.idUser,
        };
        const response=await updateAddressApi(address._id, formDataTemp, logout);
        
        if(!response){
            toast.error('Error al actualizar la direccion', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }else{
            toast.success('Direccion actualizada', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            formik.resetForm();
            setReloadAddresses(true);
            setLoading(false);
            setShowModal(false);
        }
    }


    return (
        <div className='address-form'>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Input
                    name='title'
                    type='text'
                    label='Titulo de la direccion' 
                    placeholder='Titulo de la Direccion'
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    error={formik.errors.title}    
                />
                <Form.Group widths='equal'>
                    <Form.Input 
                        name='name'
                        type='text'
                        label='Nombre y Apellidos' 
                        placeholder='Nombre y Apellidos'
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        error={formik.errors.name}  
                    />
                    <Form.Input 
                        name='address'
                        type='text'
                        label='Direccion' 
                        placeholder='Direccion'
                        onChange={formik.handleChange}
                        value={formik.values.address}
                        error={formik.errors.address}  
                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input 
                        name='city'
                        type='text'
                        label='Ciudad' 
                        placeholder='Ciudad'
                        onChange={formik.handleChange}
                        value={formik.values.city}
                        error={formik.errors.city}  
                    />
                    <Form.Input 
                        name='state'
                        type='text'
                        label='Estado/Provincia/Region' 
                        placeholder='Estado/Provincia/Region'
                        onChange={formik.handleChange}
                        value={formik.values.state}
                        error={formik.errors.state}  
                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input 
                        name='postalCode'
                        type='text'
                        label='Codigo Postal' 
                        placeholder='Codigo Postal'
                        onChange={formik.handleChange}
                        value={formik.values.postalCode}
                        error={formik.errors.postalCode}  
                    />
                    <Form.Input 
                        name='phone'
                        type='text'
                        label='Numero de Telefono' 
                        placeholder='Numero de Telefono'
                        onChange={formik.handleChange}
                        value={formik.values.phone}
                        error={formik.errors.phone}  
                    />
                </Form.Group>
                
                {newAddress? (
                    <Button color='blue' type='submit' loading={loading}>
                        <Icon name='save'/>Guardar
                    </Button>
                ):(
                    <Button color='orange' type='submit' loading={loading}>
                        <Icon name='edit'/>Editar
                    </Button>
                )}
            </Form>
        </div>
    )
}

function initialValues(address){
    return{
        title:address?.title || '',
        name:address?.name || '',
        address:address?.address || '',
        city:address?.city || '',
        state:address?.state || '',
        postalCode:address?.postalCode || '',
        phone:address?.phone || '',
    }
}

function validationSchema(){
    return{
        title:Yup.string().required(true),
        name:Yup.string().required(true),
        address:Yup.string().required(true),
        city:Yup.string().required(true),
        state:Yup.string().required(true),
        postalCode:Yup.string().required(true),
        phone:Yup.string().required(true),
    }
}