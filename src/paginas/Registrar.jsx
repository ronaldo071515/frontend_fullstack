import { useState } from 'react';
import { Link } from "react-router-dom";
import { Alerta } from '../components/Alerta';
import clienteAxios from '../config/axios';

export const Registrar = () => {
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirpassword, setRepetirPassword] = useState('');

  const [alerta, setAlerta] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if([nombre, email, password, repetirpassword].includes('')){
      setAlerta({ msg: 'Hay campos vacios', error: true });
      return;
    }

    if( password !== repetirpassword ) {
      return setAlerta({ msg: 'Los passwords no son iguales', error: true });
    }

    if( password.length < 6 ) {
      return setAlerta({ msg: 'El password es muy corto, agrega minimo 6 caracteres', error: true });
    }

    setAlerta({})

    //Crear el usuario en la API
    try {

      await clienteAxios.post('/veterinarios', { nombre, email, password });

      setAlerta({
        msg: 'Creado correctamente, revisa tu email',
        error: false
      });

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
    }

  }

  const { msg } = alerta;
  
  return (
      <>
        <div>
          <h1 className="text-indigo-600 font-black text-6xl">Crea Tu Cuenta y Administra {""} <span className="text-black">Tus Pacientes</span></h1>
        </div>

        <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>

          {/* Cargamos de manera condicional la alerta */}
          {msg && <Alerta alerta={alerta}/>}

          <form onSubmit={handleSubmit} method="POST">
            <div className="my-5">
              <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
              <input type="text" className="border w-full p-3 mt-3 bg-gray-50 rounded-xl" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu Nombre"/>
            </div>

            <div className="my-5">
              <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
              <input type="email" className="border w-full p-3 mt-3 bg-gray-50 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email de Registro"/>
            </div>

            <div className="my-5">
              <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
              <input type="password" className="border w-full p-3 mt-3 bg-gray-50 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu Password"/>
            </div>

            <div className="my-5">
              <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
              <input type="password" className="border w-full p-3 mt-3 bg-gray-50 rounded-xl" value={repetirpassword} onChange={e => setRepetirPassword(e.target.value)} placeholder="Repite Tu Password"/>
            </div>

            <input type="submit" value="Crear Cuenta" className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 md:w-auto"/>
          </form>

          <nav className='mt-10 lg:flex lg:justify-between'>
            <Link className='block text-center text-gray-500' to="/">¿Ya tienes una cuenta?, Inicia Sesión</Link>
            <Link className='block text-center text-gray-500' to="/olvide-password">Olvidé mi Password</Link>
          </nav>
        
        </div>  
      </>
  )
}
