import React, {useState, useEffect} from 'react';
import BasicLayout from '../layouts/BasicLayout/BasicLayout';
import { size } from 'lodash';
import { Button, Icon, Loader } from 'semantic-ui-react';
import useAuth from '../hooks/useAuth';
import { getBillsApi } from '../api/bill';
import BillList from '../components/Bill/BillList/BillList';
import BillForm from '../components/Bill/BillForm/BillForm';
import BasicModal from '../components/Modal/BasicModal';

export default function bills() {
    const [bills, setBills] = useState(null);
    const {auth, logout}=useAuth();
    const [showModal, setShowModal]=useState(false);
    const [titleModal, setTitleModal]=useState('');
    const [formModal, setFormModal]=useState(null);
    const [reloadBillsForm, setReloadBillsForm]=useState(false);

    useEffect(() => {
        (async () => {
            const response =await getBillsApi(auth.idUser, logout);
            setReloadBillsForm(false);
            
            if(size(response)>0){ 
                setBills(response);
            }else{
                setBills([]);
            }
        })()
    }, [reloadBillsForm])

    const openModal=(title, bill)=>{
        setTitleModal(title);
        setFormModal(
            <BillForm
                setShowModal={setShowModal}
                setReloadBillsForm={setReloadBillsForm}
                editBill={bill? false:true}
                bill={bill || null}
            />);
        setShowModal(true);
    };

    return (
            <>
                <BasicLayout>
                    <h1>Facturas</h1>
                    <Button color='blue' onClick={()=> openModal('New Bill')}>
                        <Icon name='plus' /> Add Bill
                    </Button>
                    <hr/>
                    {!bills && <Loader active>Cargando Facturas</Loader>}
                        {bills && size(bills) === 0 &&(
                            <div>
                                <h3>No hay Facturas</h3>
                            </div>
                        )}
                    {size(bills) > 0 && <BillList openModal={openModal} bills={bills} setReloadBillsForm={setReloadBillsForm}/>}
                </BasicLayout>

                <BasicModal 
                    show={showModal} 
                    setShow={setShowModal} 
                    title={titleModal}
                >
                    {formModal}
            </BasicModal>
        </>
    )
}