import '../scss/global.scss';
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import jwtDecode from 'jwt-decode';
import { setToken, getToken, removeToken } from '../api/token';
import { useRouter } from 'next/router';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartContext from '../context/CartContext';
import { getProductsCart, addProductCart, countProductsCart, removeProductCart, removeAllProductsCart } from '../api/cart';

export default function MyApp({ Component, pageProps }) {

  // ----------------------------- Hooks -----------------------------

  const [auth, setAuth]=useState(undefined);
  const [reloadUser, setReloadUser]= useState(false);
  const router =useRouter();
  const [reloadCart, setReloadCart]= useState(false);
  const [totalProductsCart, setTotalProductsCart] = useState(0)

  // ---------------------------- Token -----------------------
  useEffect(() => {
    const token=getToken();
    if(token){
      setAuth({
        token,
        idUser:jwtDecode(token).id,
      });
    }else{
      setAuth(null);
    }
    setReloadUser(false);
  }, [reloadUser]);

 // ------------------ Contar carrito al cargar -------------------
  useEffect(() => {
    setTotalProductsCart(countProductsCart());
    setReloadCart(false);
  }, [reloadCart, auth])

  // ---------------------------- Login ---------------------------------
  const login=(token)=>{
    setToken(token);
    setAuth({
      token,
      idUser:jwtDecode(token).id,
    });
  };

// ------------------ Logout ----------------------------------
  const logout=()=>{
    if(auth){
      removeToken(); // Remueve token
      setAuth(null);  // Remueve autenticacion
      router.push('/');
    } 
  }
// ------------------ Mantener Autenticacion ------------------
  const authData =useMemo(
    () =>({
      auth,
      login,
      logout,
      setReloadUser,
    }),[auth]
  );

//------------------- Agregar al carrito logueado ----------------------
const addProduct=(product)=>{
  const token=getToken();
  if(token){
    addProductCart(product);
    setReloadCart(true);
  }else{
    toast.warning('Tiene que iniciar sesion', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
  });
  }
}

// ------------------ Remover Producto del carrito --------------------
  const removeProduct=(product)=>{
    removeProductCart(product);
    setReloadCart(true);
  }

// ------------------ CartContext --------------------------
  const cartData =useMemo(
    () =>({
      productsCart:totalProductsCart,
      addProductCart: (product)=> addProduct(product),
      getProductsCart: getProductsCart,
      removeProductCart: (product)=> removeProduct(product),
      removeAllProductsCart: removeAllProductsCart,
    }),[totalProductsCart]
  );

// ------------------ Verifica autenticacion ------------------
  if(auth === undefined){
    return null;
  }

  return (
    <AuthContext.Provider value={authData}>
      <CartContext.Provider value={cartData}>
        <Component {...pageProps} />
          <ToastContainer
            position='top-right'
            autoClose={true}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover  
          />
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}