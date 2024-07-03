import Email from '../components/Email'

export default function Verify() {
  return (

    <div className='md:m-12 flex justify-center'>

      <div className="md:w-2/5 md:h-3/5 bg-zinc-300 shadow-md border-solid border-2 border-gray-500 mt-12 px-10 py-9 ">

        <h1 className='text-2xl text-slate-800'>Verificación de correo electronico</h1>
        <p className='md:ml-7 text-sm text-slate-600'>Pulse el botón para recibir su mensaje</p>
            <div>
                <Email/>
            </div>
        </div>
    </div>
  )
}
