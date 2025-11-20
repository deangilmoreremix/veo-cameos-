import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  credits: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'purchase' | 'generation' | 'refund' | 'bonus';
  description: string;
  generation_id: string | null;
  metadata: any;
  created_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserCredits(
  userId: string,
  amount: number,
  transactionType: CreditTransaction['transaction_type'],
  description: string,
  generationId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!profile) throw new Error('User profile not found');

    const newCredits = profile.credits + amount;

    if (newCredits < 0) {
      return { success: false, error: 'Insufficient credits' };
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) throw updateError;

    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount,
        transaction_type: transactionType,
        description,
        generation_id: generationId || null,
        metadata: {},
      });

    if (transactionError) throw transactionError;

    return { success: true };
  } catch (error) {
    console.error('Error updating credits:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  generationId?: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserCredits(userId, -amount, 'generation', description, generationId);
}

export async function addCredits(
  userId: string,
  amount: number,
  transactionType: 'purchase' | 'refund' | 'bonus',
  description: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserCredits(userId, amount, transactionType, description);
}

export async function getCreditTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    return [];
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'username' | 'avatar_url'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
