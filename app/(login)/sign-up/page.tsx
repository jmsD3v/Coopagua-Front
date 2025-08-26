import { Suspense } from 'react';
import { Login } from '../login';
import './globals.css';

export default function SignUpPage() {
  return (
    <div className='green-theme'>
      <Suspense>
        <Login mode='signup' />
      </Suspense>
    </div>
  );
}
