import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { getAuthenticatedUser } from '@/lib/db/queries';
import { User } from '@/lib/db/schema';
import { getDashboardPath } from '@/lib/auth/utils';
import { signOut } from '@/app/(login)/actions';
import { AnimatedCounter } from '@/components/ui/animatedCounter';

type NavbarProps = {
  user: Partial<User> & { id: number; role: "socio" | "admin" | "técnico" | "superadmin"; status: "activo" | "moroso" | "suspendido" | "baja"; } | null;
};

const Navbar = ({ user }: NavbarProps) => {
  const dashboardPath = user ? getDashboardPath(user.role) : '/sign-in';

  return (
    <nav className='bg-gray-200 shadow-md rounded-b-lg'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2'>
          <Logo />
          <span className='text-xl font-semibold text-green-800'>
            Cooperativa de Agua Potable de Las Breñas
          </span>
        </Link>
        <div className='hidden md:flex space-x-6 items-center'>
          {user ? (
            <>
              <Link
                href={dashboardPath}
                className='text-gray-600 hover:text-[#2e7d32] transition-colors'
              >
                Dashboard
              </Link>
              <form action={signOut}>
                <button
                  type='submit'
                  className='px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors shadow-md'
                >
                  Cerrar Sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href='/pricing'
                className='text-gray-600 hover:text-[#2e7d32] transition-colors'
              >
                Precios
              </Link>
              <Link
                href='/sign-in'
                className='px-6 py-2 bg-[#2e7d32] text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-md'
              >
                Ingresar
              </Link>
            </>
          )}
        </div>
        <div className='md:hidden flex items-center'>
          <button className='text-gray-600 focus:outline-none ml-2'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16m-7 6h7'
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

const Home = async () => {
  const user = await getAuthenticatedUser();

  return (
    <div className='bg-gray-200 text-gray-800 font-inter transition-colors duration-500'>
      <Navbar user={user} />

      {/* Hero Section */}
      <header className='bg-[#2e7d32] text-white text-center py-24 rounded-b-lg shadow-xl'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            ¡Agua Pura para Nuestra Comunidad!
          </h1>
          <p className='text-lg md:text-xl max-w-2xl mx-auto mb-8'>
            Llevamos agua potable de calidad a cada hogar, comprometidos con el
            bienestar y el desarrollo de Las Breñas.
          </p>
          <Link
            href='/pricing'
            className='px-8 py-4 bg-[#4caf50] text-white font-bold text-lg rounded-full hover:bg-green-600 transition-colors shadow-lg transform hover:scale-105 duration-300'
          >
            Conoce Nuestros Servicios
          </Link>
        </div>
      </header>

      {/* Animated Counter Section */}
      <section className='py-16 md:py-24 bg-gray-100 text-center rounded-lg shadow-md mx-4 md:mx-8 lg:mx-16 my-8'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-[#2e7d32] mb-4'>
            Más de <AnimatedCounter target={2500} /> hogares conectados
          </h2>
          <p className='text-lg text-gray-600'>
            Nuestro compromiso es crecer junto a la comunidad.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className='py-16 md:py-24 bg-gray-200 rounded-lg shadow-lg -mt-12 mx-4 md:mx-8 lg:mx-16 relative z-10'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-[#2e7d32] mb-12'>
            Nuestros Servicios Esenciales
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* Card 1: Pagar Facturas */}
            <div className='bg-gray-50 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105 duration-300'>
              <img
                src='/img/pago.svg'
                alt='Ícono de pago'
                className='w-16 h-16 mx-auto mb-4 text-[#2e7d32]'
              />
              <h3 className='text-xl font-semibold mb-2'>Pagar Facturas</h3>
              <p className='text-gray-600'>
                Paga tu factura en línea de forma segura y rápida.
              </p>
            </div>
            {/* Card 2: Reportar Problemas */}
            <div className='bg-gray-50 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105 duration-300'>
              <img
                src='/img/problema.svg'
                alt='Ícono de reportar problemas'
                className='w-16 h-16 mx-auto mb-4 text-[#2e7d32]'
              />
              <h3 className='text-xl font-semibold mb-2'>Reportar Problemas</h3>
              <p className='text-gray-600'>
                Ayúdanos a mantener un servicio de calidad reportando fugas o
                cortes.
              </p>
            </div>
            {/* Card 3: Agua envasada */}
            <div className='bg-gray-50 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105 duration-300'>
              <img
                src='/img/dispensadorAgua.svg'
                alt='Ícono de agua envasada'
                className='w-16 h-16 mx-auto mb-4 text-[#2e7d32]'
              />
              <h3 className='text-xl font-semibold mb-2'>
                Venta de Agua Envasada
              </h3>
              <p className='text-gray-600'>
                Ofrecemos la mejor agua purificada envasada para tu hogar y
                negocio.
              </p>
            </div>
            {/* Card 4: Conexiones */}
            <Link href='/sign-up' className='block'>
              <div className='bg-gray-50 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105 duration-300 h-full'>
                <img
                  src='/img/mas.svg'
                  alt='Ícono de solicitar conexión'
                  className='w-16 h-16 mx-auto mb-4 text-[#2e7d32]'
                />
                <h3 className='text-xl font-semibold mb-2'>
                  Solicitar Conexión
                </h3>
                <p className='text-gray-600'>
                  Si aún no tienes el servicio, solicita la conexión de agua
                  potable a tu domicilio.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Misión y Valores Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-[#2e7d32] mb-12'>
            Nuestra Misión y Valores
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold text-[#2e7d32] mb-2'>
                Misión
              </h3>
              <p className='text-gray-600'>
                Proveer un servicio de agua potable de calidad, seguro y
                accesible para toda la comunidad de Las Breñas, garantizando el
                bienestar de nuestros socios y el desarrollo sostenible de la
                región.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold text-[#2e7d32] mb-2'>
                Valores
              </h3>
              <ul className='list-disc list-inside text-gray-600 text-left'>
                <li>Compromiso con la comunidad</li>
                <li>Transparencia y honestidad</li>
                <li>Innovación tecnológica</li>
                <li>Responsabilidad ambiental</li>
              </ul>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold text-[#2e7d32] mb-2'>
                Visión
              </h3>
              <p className='text-gray-600'>
                Ser la cooperativa líder en la provisión de agua potable,
                reconocida por su excelencia en el servicio, su compromiso
                social y su contribución al crecimiento de nuestra localidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className='py-16 md:py-24 bg-gray-100 rounded-lg shadow-lg mx-4 md:mx-8 lg:mx-16 my-8'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-[#2e7d32] mb-12'>
            Nuestra Área de Cobertura
          </h2>
          <div className='rounded-lg overflow-hidden shadow-lg'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.817297905186!2d-61.082729384974!3d-27.481525582885974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9441a18c6f7d0889%3A0x7d6b38c3e80a068d!2sLas%20Bre%C3%B1as%2C%20Chaco%20Province%2C%20Argentina!5e0!3m2!1sen!2s!4v1625470000000!5m2!1sen!2s'
              width='100%'
              height='450'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
              title='Mapa de Las Breñas'
            ></iframe>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-[#2e7d32] mb-12'>
            Noticias y Novedades
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* News Article 1 */}
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-2 text-[#2e7d32]'>
                Inauguración de la Nueva Planta de Tratamiento
              </h3>
              <p className='text-gray-600 mb-4'>
                Con una inversión de $10 millones, nuestra cooperativa ha puesto
                en marcha la planta de tratamiento más moderna de la región.
              </p>
              <a
                href='#'
                className='text-[#4caf50] hover:underline font-semibold'
              >
                Leer más &rarr;
              </a>
            </div>
            {/* News Article 2 */}
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-2 text-[#2e7d32]'>
                Charla sobre el Uso Responsable del Agua
              </h3>
              <p className='text-gray-600 mb-4'>
                Invitamos a toda la comunidad a participar en nuestra charla
                informativa sobre la importancia de cuidar este recurso vital.
              </p>
              <a
                href='#'
                className='text-[#4caf50] hover:underline font-semibold'
              >
                Leer más &rarr;
              </a>
            </div>
            {/* News Article 3 */}
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-2 text-[#2e7d32]'>
                Mantenimiento Preventivo en la Red de Distribución
              </h3>
              <p className='text-gray-600 mb-4'>
                Anunciamos el cronograma de mantenimiento para asegurar el buen
                funcionamiento del servicio en todos los barrios.
              </p>
              <a
                href='#'
                className='text-[#4caf50] hover:underline font-semibold'
              >
                Leer más &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-[#2e7d32]'>
            ¿Tienes una pregunta?
          </h2>
          <p className='text-lg text-gray-600 mb-8 max-w-3xl mx-auto'>
            Nuestro equipo está listo para ayudarte. Contáctanos para resolver
            cualquier duda o inquietud que tengas.
          </p>
          <a
            href='#'
            className='px-8 py-4 bg-gray-700 text-white font-bold text-lg rounded-full hover:bg-gray-900 transition-colors shadow-lg transform hover:scale-105 duration-300'
          >
            Contáctanos
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-[#2e7d32] text-white py-8 rounded-t-lg shadow-md'>
        <div className='container mx-auto px-4 text-center'>
          <p>
            &copy; {new Date().getFullYear()} Cooperativa de Agua Potable de Las
            Breñas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
