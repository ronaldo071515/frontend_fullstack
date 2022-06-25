import { createContext, useState, useEffect } from "react";
import clienteAxios from '../config/axios'


const PacientesContext = createContext()

export const PacientesProvider = ({ children }) => {

    const [pacientes, setPacientes] = useState([])
    const [paciente, setPaciente] = useState({})

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${ token }`
                    }
                }
                const { data } = await clienteAxios('/pacientes', config)
                setPacientes(data.pacientes)

            } catch (error) {
                console.log(error)
            }
        }

        obtenerPacientes()
    }, [])

    const guardarPaciente = async (paciente) => {

        const token = localStorage.getItem('token')
        const config = {
            headers: {
                "Content-Type": "application/json",
                token: `Bearer ${ token }`
            }
        }

        if( paciente.id ) {
            try {
                const { data } = await clienteAxios.put(`/pacientes/${ paciente.id }`, paciente, config)
                
                const pacientesActualizado = pacientes.map( pacienteState => pacienteState._id === data.pacienteActualizado._id ? data.pacienteActualizado : pacienteState )

                setPacientes( pacientesActualizado)

            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const { data } = await clienteAxios.post('/pacientes', paciente, config)
    
                const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data
                
                setPacientes([pacienteAlmacenado.pacienteAlmacenado, ...pacientes])
                
            } catch (error) {
                //console.log(error.response.data.msg)
            }
        }

    }

    const setEdicion = async (paciente) => {
        setPaciente(paciente)
    }

    const eliminarPaciente = async id => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
                try {

                    const token = localStorage.getItem('token')
                    const config = {
                        headers: {
                            "Content-Type": "application/json",
                            token: `Bearer ${ token }`
                        }
                    }
        
                    const { data } = clienteAxios.delete(`/pacientes/${ id }`, config)

                    const pacientesActualizado = pacientes.filter( pacientesState => pacientesState._id !== id)

                    setPacientes(pacientesActualizado)

                    Swal.fire(
                        'Eliminado!',
                        'Paciente ha sido eliminado.',
                        'success'
                    )
                        
                    } catch (error) {
                        console.log(error)
                    }
            }
          })
    }

    return(
        <PacientesContext.Provider
            value={{
                pacientes,
                paciente,
                guardarPaciente,
                setEdicion,
                eliminarPaciente
            }}>
            { children }
        </PacientesContext.Provider>
    )
}

export default PacientesContext;