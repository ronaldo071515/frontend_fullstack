import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/axios'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [ cargando, setCargando ] = useState(true)
    const [ auth, setAuth ] = useState({})

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                setCargando(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    token: `Bearer ${ token }`
                }
            }
            try {
                const { data } = await clienteAxios('/veterinarios/perfil', config)
                setAuth(data)               
            } catch (error) {
                console.log(error.response.data.msg)
                setAuth({})
            }
            setCargando(false);
        }
        autenticarUsuario()
        
    }, [])

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        setAuth({})
    }

    const actualizarPerfil = async datos => {
        const token = localStorage.getItem('token');
        if(!token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                token: `Bearer ${ token }`
            }
        }

        try {
            const url = `/veterinarios/perfil/${datos._id}`
            const data = await clienteAxios.put(url, datos, config)

            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
            Toast.fire({
                icon: 'success',
                title: 'Editado correcatamente'
            })

            return {
                msg: 'Editado correcatamente'
            }

        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }

    const guardarPassword = async (datos) => {
        const token = localStorage.getItem('token');
        if(!token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                token: `Bearer ${ token }`
            }
        }

        try {

            const url = `/veterinarios/actualizar-password`
            const data = await clienteAxios.put(url, datos, config)
            console.log(data.data)
            return {
                msg: data.data.msg
            }
            
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }

    } 

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}>
            { children }
        </AuthContext.Provider>
    )

}

export {
    AuthProvider
}

export default AuthContext