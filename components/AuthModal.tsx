import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, KeyRound, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Button } from './Button';
import { useSupabase } from '../contexts/SupabaseContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot_password';
type RecoveryStep = 'email' | 'code' | 'new_password';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Recovery Flow State
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('email');
  const [otpCode, setOtpCode] = useState('');
  
  // Common Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { sendRecoveryCode, verifyRecoveryCode, updatePassword } = useSupabase();

  if (!isOpen) return null;

  const resetState = () => {
    setMode('login');
    setRecoveryStep('email');
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setOtpCode('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        handleClose();
      } 
      else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name,
            },
          },
        });
        if (error) throw error;
        alert('Registro exitoso! Ya puedes iniciar sesión.');
        setMode('login');
      } 
      else if (mode === 'forgot_password') {
        // --- FLUJO DE RECUPERACIÓN PASO A PASO ---
        
        if (recoveryStep === 'email') {
            // Paso 1: Enviar Código
            await sendRecoveryCode(email);
            setRecoveryStep('code');
            setSuccessMsg('Código enviado a tu correo');
        } 
        else if (recoveryStep === 'code') {
            // Paso 2: Verificar Código
            await verifyRecoveryCode(email, otpCode);
            setRecoveryStep('new_password');
            setSuccessMsg('Código verificado. Crea tu nueva contraseña.');
        } 
        else if (recoveryStep === 'new_password') {
            // Paso 3: Guardar Nueva Contraseña
            await updatePassword(password);
            setSuccessMsg('¡Contraseña actualizada con éxito!');
            setTimeout(() => {
                handleClose(); // Cerrar modal y dejar al usuario logueado
            }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'forgot_password') {
        switch(recoveryStep) {
            case 'email': return 'Recuperar Cuenta';
            case 'code': return 'Código de Seguridad';
            case 'new_password': return 'Nueva Contraseña';
        }
    }
    switch(mode) {
      case 'login': return 'Bienvenido de Nuevo';
      case 'register': return 'Únete a Fifo';
    }
    return '';
  };

  const getSubtitle = () => {
    if (mode === 'forgot_password') {
        switch(recoveryStep) {
            case 'email': return 'Ingresa tu correo para recibir un código';
            case 'code': return `Ingresa el código enviado a ${email}`;
            case 'new_password': return 'Escribe tu nueva contraseña segura';
        }
    }
    switch(mode) {
      case 'login': return 'Ingresa para ver tus favoritos y perfil';
      case 'register': return 'Regístrate para guardar tus combos preferidos';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={handleClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-fifo-red transition-colors">
          <X size={24} />
        </button>

        {mode === 'forgot_password' && (
           <button 
             onClick={() => { 
                if (recoveryStep === 'code') setRecoveryStep('email');
                else if (recoveryStep === 'new_password') setRecoveryStep('code');
                else setMode('login'); 
                setError(null); 
                setSuccessMsg(null); 
             }} 
             className="absolute top-4 left-4 text-gray-400 hover:text-fifo-red transition-colors flex items-center gap-1 text-xs font-bold uppercase"
           >
             <ArrowLeft size={16} /> Volver
           </button>
        )}

        <div className="text-center mb-8 mt-2">
          {mode === 'forgot_password' && (
             <div className="w-16 h-16 bg-fifo-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4 text-fifo-darkRed">
                {recoveryStep === 'email' && <Mail size={32} />}
                {recoveryStep === 'code' && <ShieldCheck size={32} />}
                {recoveryStep === 'new_password' && <KeyRound size={32} />}
             </div>
          )}
          <h2 className="text-3xl font-black text-fifo-red uppercase mb-2">
            {getTitle()}
          </h2>
          <p className="text-gray-500 text-sm font-medium px-4">
            {getSubtitle()}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-sm font-medium text-center border border-green-100 flex items-center justify-center gap-2">
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER NAME INPUT */}
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Tu Nombre"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-xl border border-gray-200 focus:border-fifo-red focus:ring-1 focus:ring-fifo-red outline-none transition-all font-medium"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            {/* EMAIL INPUT (Login, Register, Recovery Step 1) */}
            {(mode !== 'forgot_password' || recoveryStep === 'email') && (
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="email" 
                    placeholder="Correo Electrónico"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-xl border border-gray-200 focus:border-fifo-red focus:ring-1 focus:ring-fifo-red outline-none transition-all font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    readOnly={mode === 'forgot_password' && recoveryStep !== 'email'}
                />
                </div>
            )}

            {/* OTP CODE INPUT (Recovery Step 2) */}
            {mode === 'forgot_password' && recoveryStep === 'code' && (
                <div className="relative animate-in slide-in-from-right duration-300">
                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Código de Verificación"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-xl border border-gray-200 focus:border-fifo-red focus:ring-1 focus:ring-fifo-red outline-none transition-all font-medium tracking-widest text-lg"
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
            )}

            {/* PASSWORD INPUT (Login, Register, Recovery Step 3) */}
            {(mode !== 'forgot_password' || recoveryStep === 'new_password') && (
                <div className={`relative ${recoveryStep === 'new_password' ? 'animate-in slide-in-from-right duration-300' : ''}`}>
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                    type="password" 
                    placeholder={recoveryStep === 'new_password' ? "Nueva Contraseña" : "Contraseña"}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-xl border border-gray-200 focus:border-fifo-red focus:ring-1 focus:ring-fifo-red outline-none transition-all font-medium"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoFocus={recoveryStep === 'new_password'}
                    />
                </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => { setMode('forgot_password'); setRecoveryStep('email'); setError(null); }}
                  className="text-xs font-bold text-gray-400 hover:text-fifo-red transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <Button fullWidth disabled={loading} className="py-4 shadow-lg text-lg uppercase">
              {loading ? 'Procesando...' : 
               mode === 'login' ? 'Iniciar Sesión' : 
               mode === 'register' ? 'Registrarme' : 
               recoveryStep === 'email' ? 'Enviar Código' :
               recoveryStep === 'code' ? 'Verificar Código' :
               'Guardar Contraseña'}
            </Button>
        </form>

        {mode !== 'forgot_password' && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => { 
                setError(null); 
                setMode(mode === 'login' ? 'register' : 'login'); 
              }}
              className="text-sm font-bold text-gray-500 hover:text-fifo-red transition-colors underline"
            >
              {mode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};