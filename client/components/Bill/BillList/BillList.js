import React, { useState } from 'react'
import { map, size } from 'lodash';
import { Button, Icon, Label, Table } from 'semantic-ui-react';
import { deleteBillApi } from '../../../api/bill';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

export default function BillList(props) {
    const {bills, setReloadBillsForm, openModal} =props;
    
    return (
        <Table celled compact definition>
            <Table.Header fullWidth>
            <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Invoice Ref</Table.HeaderCell>
                <Table.HeaderCell>Supplier</Table.HeaderCell>
                <Table.HeaderCell>Currency</Table.HeaderCell>
                <Table.HeaderCell>Invoice Date</Table.HeaderCell>
                <Table.HeaderCell>Due Date</Table.HeaderCell>
                <Table.HeaderCell>File</Table.HeaderCell>
                <Table.HeaderCell/>
                
            </Table.Row>
            </Table.Header>
            <Table.Body>
                {map(bills, (bill)=>(
                    <Bill openModal={openModal} key={bill._id} bill={bill} setReloadBillsForm={setReloadBillsForm}/>
                ))}
                
            </Table.Body>
        </Table>
    )
}

function Bill(props) {
    const {bill, setReloadBillsForm, openModal}=props;
    const {fileBill}=bill;
    const [loadingDelete, setLoadingDelete] = useState(false);
    const {auth, logout}=useAuth();

    const deleteBill=async()=>{
        setLoadingDelete(true);

        const response= await deleteBillApi(bill._id, logout);
        
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
            toast.success('Deleted', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setReloadBillsForm(true);
            setLoadingDelete(false);
        }
    }

    return(
        <Table.Row>
            <Table.Cell collapsing>
                1
            </Table.Cell>
            <Table.Cell>{bill.invoiceRef}</Table.Cell>
            <Table.Cell>{bill.supplierName}</Table.Cell>
            <Table.Cell>{bill.currency}</Table.Cell>
            <Table.Cell>{bill.invoiceDate}</Table.Cell>
            <Table.Cell>{bill.dueDate}</Table.Cell>

            {size(fileBill)=== 0 && <Table.Cell warning><Icon name='attention' />No hay archivo</Table.Cell> }
            {size(fileBill)> 0 && <Table.Cell><Icon name='attention' />{fileBill}</Table.Cell> }
            <Table.Cell>
                <Button 
                    circular 
                    icon='edit' 
                    color='orange'
                    onClick={()=>openModal(`Edit Invoice: ${bill.invoiceRef}`, bill)}
                />
                <Button 
                    circular 
                    icon='x' 
                    color='red' 
                    loading={loadingDelete} 
                    onClick={()=>deleteBill()}
                />
            </Table.Cell>
        </Table.Row>
    )
}
