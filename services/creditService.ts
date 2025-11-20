import { supabase } from './supabaseClient';

export interface CreditBalance {
  credits: number;
  totalSpent: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  transactionType: 'purchase' | 'generation' | 'refund' | 'bonus';
  description: string;
  createdAt: string;
}

export const creditService = {
  async getUserBalance(userId: string): Promise<CreditBalance | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('credits, total_spent')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user balance:', error);
      return null;
    }

    if (!data) return null;

    return {
      credits: data.credits,
      totalSpent: data.total_spent,
    };
  },

  async deductCredits(userId: string, amount: number, generationId: string, description: string): Promise<boolean> {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError || !profile) {
      console.error('Error fetching user profile:', fetchError);
      return false;
    }

    if (profile.credits < amount) {
      console.error('Insufficient credits');
      return false;
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: profile.credits - amount })
      .eq('id', userId);

    if (updateError) {
      console.error('Error deducting credits:', updateError);
      return false;
    }

    const { error: txError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -amount,
        transaction_type: 'generation',
        description,
        generation_id: generationId,
      });

    if (txError) {
      console.error('Error logging transaction:', txError);
    }

    return true;
  },

  async addCredits(userId: string, amount: number, type: 'purchase' | 'bonus' | 'refund', description: string, metadata: any = {}): Promise<boolean> {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('credits, total_spent')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError || !profile) {
      console.error('Error fetching user profile:', fetchError);
      return false;
    }

    const updates: any = { credits: profile.credits + amount };

    if (type === 'purchase') {
      updates.total_spent = profile.total_spent + metadata.price || 0;
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (updateError) {
      console.error('Error adding credits:', updateError);
      return false;
    }

    const { error: txError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount,
        transaction_type: type,
        description,
        metadata,
      });

    if (txError) {
      console.error('Error logging transaction:', txError);
    }

    return true;
  },

  async getTransactionHistory(userId: string, limit: number = 50): Promise<CreditTransaction[]> {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('id, amount, transaction_type, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }

    return data.map(tx => ({
      id: tx.id,
      amount: tx.amount,
      transactionType: tx.transaction_type,
      description: tx.description,
      createdAt: tx.created_at,
    }));
  },
};
