import React, { useState } from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { addFileBillApi, createBillsApi, updateBillApi } from '../../../api/bill';
import FileUpload from '../../FileUpload/FileUpload';
import { v4 as uuidv4 } from 'uuid';

export default function BillForm(props) {
    const {auth, logout}=useAuth();
    const [loading, setLoading]=useState(false);
    const [fileBill, setFileBill]=useState(null);
    const {setShowModal, setReloadBillsForm, editBill, bill}=props;

    const formik=useFormik({
        initialValues:initialValues(bill),
        validationSchema:Yup.object(validationSchema()),
        onSubmit:(formData)=>{
            editBill
            ?addBill(formData)
            :billEdit(formData)
        },
    });

    const addBill=async (formData)=>{
        setLoading(true);
        const formDataTemp={
            ...formData,
            user:auth.idUser,
            fillBill:uuidv4(),
        };

        const fileDataTemp={
            user:auth.idUser,
            uuid:uuidv4(),
            fileJson:{fileBill},
        };

        const response=await createBillsApi(formDataTemp, logout);
        const responsefile=await addFileBillApi(fileDataTemp, logout);  

        if(!response){
            toast.error('Error', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }else{
            toast.success('Saved', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            formik.resetForm();
            setReloadBillsForm(true);
            setLoading(false);
            setShowModal(false);
        }
    }

    const billEdit=async (formData)=>{
        setLoading(true);
        const formDataTemp={
            ...formData,
            user:auth.idUser,
        };

        const response=await updateBillApi(bill._id, formDataTemp, logout); 

        if(!response){
            toast.error('Error', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }else{
            toast.success('Edit', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            formik.resetForm();
            setReloadBillsForm(true);
            setLoading(false);
            setShowModal(false);
        }
    }

return (
    <div>
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group widths='equal'>
                <Form.Input 
                    name='supplierName'
                    type='text'
                    label='Proveedor' 
                    placeholder='Proveedor'
                    onChange={formik.handleChange}
                    value={formik.values.supplierName}
                    error={formik.errors.supplierName} 
                />
                <Form.Input 
                    name='currency'
                    type='text'
                    label='Moneda' 
                    placeholder='COP'
                    onChange={formik.handleChange}
                    value={formik.values.currency}
                    error={formik.errors.currency} 
                />
                <Form.Input 
                    name='invoiceDate'
                    type='date'
                    label='Fecha de la Factura'
                    onChange={formik.handleChange}
                    value={formik.values.invoiceDate}
                    error={formik.errors.invoiceDate}
                />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input 
                    name='dueDate'
                    type='date'
                    label='Fecha Vence Factura'
                    onChange={formik.handleChange}
                    value={formik.values.dueDate}
                    error={formik.errors.dueDate}
                />
                <Form.Input 
                    name='invoiceRef'
                    type='text'
                    label='Referencia Factura'
                    onChange={formik.handleChange}
                    value={formik.values.invoiceRef}
                    error={formik.errors.invoiceRef}
                />
            </Form.Group>

            <FileUpload setFileBill={setFileBill}/>
                {editBill?(
                    <Button color='blue' type='submit' loading={loading} >
                        <Icon name='save'/>Save
                    </Button>
                ):(
                    <Button color='orange' type='submit' loading={loading}>
                        <Icon name='edit'/> Edit
                    </Button>
                )}
        </Form>
    </div>
    )
}

function initialValues(bill){
    return{
        supplierName:bill?.supplierName || '',
        currency:bill?.currency || '',
        invoiceRef:bill?.invoiceRef || '',
        invoiceDate:bill?.invoiceDate || '',
        dueDate:bill?.dueDate || '',
    }
}

function validationSchema(){
    return{
        supplierName:Yup.string().required(true),
        currency:Yup.string().required(true),
        invoiceDate:Yup.date().required(true),
        dueDate:Yup.date().required(true),
        invoiceRef:Yup.string().required(true),
    }
}
