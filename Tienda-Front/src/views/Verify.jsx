import Email from '../components/Email'

export default function Verify() {
  return (

    <div className='md:m-12 flex justify-center font-playfair'>

      <div className="md:w-full md:h-3/5 bg-transparent mt-12 px-10 py-9 ">

        <h1 className='text-2xl text-slate-800'>Verificación de correo electronico</h1>
        <p className='md:ml-7 text-sm text-slate-600'>Pulse el botón para recibir su mensaje</p>
            <div>
                <Email/>
            </div>
        </div>
    </div>
  )
}
