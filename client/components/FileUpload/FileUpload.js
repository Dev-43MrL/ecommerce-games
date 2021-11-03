import React, {useState, useRef} from 'react';
import { Form } from 'semantic-ui-react';
//import { v4 as uuidv4 } from 'uuid';uuidv4()

export default function FileUpload(props) {
    const {setFileBill}=props;
    const input = useRef(null);
    const [result, setResult] = useState("");

    const onFileUploaded = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
      reader.addEventListener("load", () => setResult(reader.result));
      };


      setFileBill(result);

    return (
        <Form>
            <Form.Group>
                <Form.Input 
                    name='fileBill'
                    type='file'
                    label='Sube Archivo de Factura'
                    ref={input} 
                    onChange={(e)=>onFileUploaded(e)}
                />
            </Form.Group>
        </Form>
    )
}


// function getBase64(e) {
//     const [files, setFiles] = useState();

//     let file = e.target.files[0];
//     console.log(file);

//     const reader = new FileReader();
//     reader.onloadend = function () {
//         setFiles(reader.result.toString());
//     };
//     reader.readAsDataURL(file);

//     console.log(file);

//     return(
//         console.log({files})
//     )
    
// }