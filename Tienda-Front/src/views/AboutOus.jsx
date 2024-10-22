export default function AboutUs() {
    const baseURL = import.meta.env.VITE_API_URL;
  
    return (
      <div className="container mx-auto p-0">
        {/* Sección Sobre Nosotros */}
        <section className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Sobre Nosotros</h2>
            <p className="text-base md:text-lg mb-4">
              Antonio&apos;s Project comenzó su andadura en el año 2005 con una visión global y la intención de vestir a jóvenes comprometidos con su entorno, que viven en comunidad y disfrutan de conectar con los demás. Jóvenes que buscan un estilo relajado, alejándose de los estereotipos y queriendo sentirse bien con lo que llevan. Para ellos, Antonio&apos;s Project captura las últimas tendencias internacionales, las fusiona con influencias urbanas y culturales, y las reinterpreta en prendas cómodas y fáciles de llevar.
            </p>
            <p className="text-base md:text-lg mb-4">
              Antonio&apos;s Project evoluciona junto a sus clientes, siempre atento a las nuevas tecnologías, movimientos sociales y las últimas tendencias artísticas y musicales. Todo esto se refleja no solo en sus diseños, sino también en sus tiendas. Inspirada en la vibrante ciudad de Barcelona, la renovación de la oferta es constante. Dos veces por semana, todas las tiendas reciben nuevos productos.
            </p>
            <p className="text-base md:text-lg mb-4">
              Como parte del Grupo Fashionistas (Antonio&apos;s Project, Style&Co, UrbanVibe, TrendyWear y EcoStyle), Antonio&apos;s Project está presente en 50 países con una red de más de 300 tiendas físicas y una tienda online que llega a todo el mundo.
            </p>
          </div>
          <div className="md:w-1/2 md:m-0">
            <img src={`${baseURL}/icon/Logo.png`} alt="Sobre Nosotros" className="w-full h-auto object-cover" />
          </div>
        </section>
  
        {/* Sección Respeto al Medio Ambiente */}
        <section className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Respeto al Medio Ambiente</h2>
            <p className="text-base md:text-lg mb-4">
              En Antonio&apos;s Project, estamos comprometidos con la sostenibilidad y el respeto por el medio ambiente en todas nuestras operaciones. Nuestro edificio ha sido diseñado para ser un ejemplo de eficiencia energética, logrando un ahorro del 18% en comparación con estructuras convencionales. Gracias a una fachada exterior adaptada a su orientación y una estrategia de control solar mediante grandes planchas exteriores, aprovechamos al máximo la luz natural, contribuyendo significativamente a nuestros esfuerzos de eficiencia energética.
            </p>
            <p className="text-base md:text-lg mb-4">
              El uso racional del agua es otra de nuestras prioridades. Hemos logrado un ahorro del 50% en el consumo de agua potable mediante la instalación de grifos con sensores, que reducen el desperdicio de agua, y el uso de una depuradora propia que permite tratar el agua usada para su reutilización en el riego y en las descargas de los baños, completando así el ciclo de uso del agua.
            </p>
            <p className="text-base md:text-lg mb-4">
              La calidad del ambiente interior es una prioridad para nosotros. Utilizamos diversos sistemas y acciones para optimizar la calidad del aire en nuestras oficinas, desde sensores que controlan los niveles de CO2 hasta filtros en el sistema de ventilación que evitan la entrada de contaminantes. Además, empleamos pinturas y adhesivos con bajo contenido de compuestos orgánicos volátiles, garantizando así un entorno de trabajo saludable y seguro para todos.
            </p>
          </div>
          <div className="md:w-1/2 md:m-0">
            <img src={`${baseURL}/icon/Logo.png`} alt="Respeto al Medio Ambiente" className="w-full h-auto object-cover" />
          </div>
        </section>
  
        {/* Sección Lugar de Procedencia */}
        <section className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Lugar de Procedencia</h2>
            <p className="text-base md:text-lg mb-4">
              Antonio&apos;s Project comenzó en junio de 2018 con la misión de ofrecer moda accesible y de alta calidad, enfocada en la inclusión y el desarrollo comunitario. Nuestro primer establecimiento se ubicó en el corazón de Sevilla, España, una ciudad rica en cultura y tradición, que refleja perfectamente el espíritu vibrante y acogedor de nuestra marca.
            </p>
            <p className="text-base md:text-lg mb-4">
              Nuestra tienda en Puerto Santa María comercializa una amplia gama de productos, desde nuestras colecciones más recientes hasta piezas clásicas, siempre manteniendo la esencia y calidad que nos caracteriza. Gestionada por un equipo diverso de personas con diferentes tipos de discapacidad, tanto física como intelectual, nuestra tienda no solo ofrece moda, sino también una experiencia única y enriquecedora para nuestros clientes.
            </p>
            <p className="text-base md:text-lg mb-4">
              Antonio&apos;s Project es más que una tienda de ropa; es un proyecto social que promueve la inclusión y la igualdad. Con el apoyo de la comunidad y nuestros colaboradores, seguimos creciendo y expandiéndonos, con planes para abrir nuevas tiendas que reflejen nuestro compromiso con la integración y la excelencia.
            </p>
            <p className="text-base md:text-lg mb-0">
              Estamos orgullosos de nuestra historia y dedicados a continuar nuestro trabajo, demostrando que la moda puede ser un motor de cambio positivo y un vehículo para la inclusión social.
            </p>
          </div>
          <div className="md:w-1/2 md:m-0">
            <img src={`${baseURL}/icon/Logo.png`} alt="Lugar de Procedencia" className="w-full h-auto object-cover" />
          </div>
        </section>
      </div>
    );
  }
  