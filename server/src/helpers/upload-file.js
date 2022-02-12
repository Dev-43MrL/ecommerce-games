const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject ) => {
       
        const { file } = files;
        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[ nombreCortado.length -1 ];
        
        // Validar la extension
        if( !extensionesValidas.includes( extension ) ){
            return reject(`La extension ${ extension } no es permitida, ${ extensionesValidas }`);
        }

        const nombreTemp = uuidv4() +'.'+ extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        
        file.mv(uploadPath, (err) => {
            if (err) {
                reject( err );
            }
        
            resolve( nombreTemp );
        });
    })
}

module.exports = {
    uploadFile
}