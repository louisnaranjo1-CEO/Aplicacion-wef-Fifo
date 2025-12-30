import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

export interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  points_to_award: number;
  status: 'pending' | 'approved';
  description: string;
  proof_url?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  points: number;
  phone?: string;
  cedula?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
}

interface SupabaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  favorites: string[]; 
  points: number;
  orders: Order[];
  toggleFavorite: (productId: string) => Promise<void>;
  recordView: (productId: string) => Promise<void>;
  recordPurchase: (productId: string, quantity: number) => Promise<void>;
  createOrder: (amount: number, points: number, desc: string) => Promise<void>;
  validateOrder: (orderId: string) => Promise<boolean>;
  uploadOrderProof: (orderId: string, file: File) => Promise<string | null>;
  approveOrderWithProof: (orderId: string, proofUrl: string) => Promise<boolean>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  sendRecoveryCode: (email: string) => Promise<void>;
  verifyRecoveryCode: (email: string, token: string) => Promise<any>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFavorites(session.user.id);
        fetchOrders(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFavorites(session.user.id);
        fetchOrders(session.user.id);
      } else {
        setProfile(null);
        setFavorites([]);
        setPoints(0);
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
      setPoints(data.points || 0);
    }
  };

  const fetchFavorites = async (userId: string) => {
    const { data, error } = await supabase.from('favorites').select('product_id').eq('user_id', userId);
    if (!error && data) setFavorites(data.map((item: any) => item.product_id));
  };

  const fetchOrders = async (userId: string) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data as Order[]);
  };

  const createOrder = async (amount: number, pointsToAward: number, desc: string) => {
    if (!user) return;
    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      total_amount: amount,
      points_to_award: pointsToAward,
      description: desc,
      status: 'pending'
    });
    if (!error) fetchOrders(user.id);
  };

  const validateOrder = async (orderId: string) => {
    const { data, error } = await supabase.rpc('validate_order_points', { 
      order_id_input: orderId
    });

    if (error) {
      console.error(error);
      return false;
    }

    if (data === true) {
      if (user) {
        fetchProfile(user.id);
        fetchOrders(user.id);
      }
      return true;
    }
    return false;
  };

  const uploadOrderProof = async (orderId: string, file: File) => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('order_proofs')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading proof:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('order_proofs').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const approveOrderWithProof = async (orderId: string, proofUrl: string) => {
      await supabase.from('orders').update({ proof_url: proofUrl }).eq('id', orderId); 
      const success = await validateOrder(orderId);
      return success;
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) throw new Error("Debes iniciar sesión");
    const exists = favorites.includes(productId);
    setFavorites(prev => exists ? prev.filter(id => id !== productId) : [...prev, productId]);
    if (exists) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, product_id: productId });
    }
  };

  const recordView = async (productId: string) => {
    // UPDATED: Use the new secure RPC function defined in your SQL script
    // This replaces the direct table update which is now restricted by RLS
    const { error } = await supabase.rpc('increment_product_view', { p_id: productId });
    
    if (error) {
      console.error("Error recording view:", error);
    }
  };

  const recordPurchase = async (productId: string, quantity: number) => {
    // Note: ensure you have an RPC or policy for purchases in your SQL as well, 
    // otherwise this might fail if RLS is strict on updates.
    const { data } = await supabase.from('product_stats').select('purchases').eq('product_id', productId).single();
    await supabase.from('product_stats').upsert({
      product_id: productId,
      purchases: (data?.purchases || 0) + quantity
    }, { onConflict: 'product_id' });
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;

    // Update Auth Metadata if display_name is present
    if (data.display_name) {
      await supabase.auth.updateUser({ data: { display_name: data.display_name } });
      setUser(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, display_name: data.display_name } } : null);
    }

    // Update Database Profile
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;
    
    // Refresh local profile state
    fetchProfile(user.id);
  };

  // 1. Enviar código OTP para login
  const sendRecoveryCode = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  // 2. Verificar código (esto loguea al usuario)
  const verifyRecoveryCode = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({ 
        email, 
        token, 
        type: 'email' 
    });
    if (error) throw error;
    return data;
  };

  // 3. Cambiar contraseña (estando logueado)
  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <SupabaseContext.Provider value={{ 
      user, profile, loading, favorites, points, orders,
      toggleFavorite, recordView, recordPurchase, 
      createOrder, validateOrder, uploadOrderProof, approveOrderWithProof,
      updateProfileData, sendRecoveryCode, verifyRecoveryCode, updatePassword, signOut,
      refreshFavorites: () => user ? fetchFavorites(user.id) : Promise.resolve(),
      refreshOrders: () => user ? fetchOrders(user.id) : Promise.resolve()
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) throw new Error('useSupabase must be used within a SupabaseProvider');
  return context;
};