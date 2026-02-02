/**
 * TakuraBid Payment Service
 * Supports Cash, EcoCash, and Bank Transfer payments for Zimbabwe
 */

import { supabase } from '@/lib/supabase'

// Payment method types
export type PaymentMethod = 'cash' | 'ecocash' | 'bank_transfer' | 'innbucks'

export interface PaymentMethodInfo {
  id: PaymentMethod
  name: string
  icon: string
  description: string
  processingTime: string
  fee: number // percentage
  minAmount: number
  maxAmount: number
  available: boolean
}

// Available payment methods in Zimbabwe
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: '💵',
    description: 'Pay driver in cash upon delivery',
    processingTime: 'Instant',
    fee: 0,
    minAmount: 1,
    maxAmount: 10000,
    available: true
  },
  {
    id: 'ecocash',
    name: 'EcoCash',
    icon: '📱',
    description: 'Pay via Econet EcoCash mobile money',
    processingTime: 'Instant',
    fee: 1.5,
    minAmount: 1,
    maxAmount: 5000,
    available: true
  },
  {
    id: 'innbucks',
    name: 'InnBucks',
    icon: '🏦',
    description: 'Pay via InnBucks wallet',
    processingTime: 'Instant',
    fee: 1.0,
    minAmount: 1,
    maxAmount: 5000,
    available: true
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: '🏛️',
    description: 'Direct bank transfer (FBC, CBZ, Stanbic)',
    processingTime: '1-2 business days',
    fee: 0.5,
    minAmount: 50,
    maxAmount: 50000,
    available: true
  }
]

export interface Payment {
  id: string
  load_id: string
  payer_id: string
  payee_id: string
  amount: number
  currency: 'USD' | 'ZWL'
  payment_method: PaymentMethod
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  reference: string
  ecocash_number?: string
  bank_details?: {
    bank_name: string
    account_number: string
    branch_code: string
  }
  created_at: string
  completed_at?: string
  metadata?: Record<string, unknown>
}

export interface PaymentRequest {
  loadId: string
  payerId: string
  payeeId: string
  amount: number
  currency: 'USD' | 'ZWL'
  paymentMethod: PaymentMethod
  ecocashNumber?: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    branchCode: string
  }
}

/**
 * Generate unique payment reference
 */
function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TB-${timestamp}-${random}`
}

/**
 * Calculate payment fee
 */
export function calculatePaymentFee(amount: number, method: PaymentMethod): number {
  const methodInfo = PAYMENT_METHODS.find(m => m.id === method)
  if (!methodInfo) return 0
  return Math.round(amount * (methodInfo.fee / 100) * 100) / 100
}

/**
 * Calculate total with fee
 */
export function calculateTotalWithFee(amount: number, method: PaymentMethod): {
  subtotal: number
  fee: number
  total: number
} {
  const fee = calculatePaymentFee(amount, method)
  return {
    subtotal: amount,
    fee,
    total: Math.round((amount + fee) * 100) / 100
  }
}

export const paymentService = {
  /**
   * Create a new payment
   */
  async createPayment(request: PaymentRequest): Promise<Payment> {
    const reference = generateReference()
    const fee = calculatePaymentFee(request.amount, request.paymentMethod)
    
    const paymentData = {
      load_id: request.loadId,
      payer_id: request.payerId,
      payee_id: request.payeeId,
      amount: request.amount,
      fee_amount: fee,
      currency: request.currency,
      payment_method: request.paymentMethod,
      status: request.paymentMethod === 'cash' ? 'pending' : 'processing',
      reference,
      ecocash_number: request.ecocashNumber,
      bank_details: request.bankDetails,
      metadata: {}
    }

    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Initiate EcoCash payment
   */
  async initiateEcoCashPayment(
    paymentId: string, 
    phoneNumber: string, 
    amount: number
  ): Promise<{ success: boolean; message: string; ussdPrompt?: string }> {
    // In production, this would integrate with EcoCash API
    // For now, we simulate the USSD prompt
    const formattedPhone = phoneNumber.startsWith('0') 
      ? `263${phoneNumber.slice(1)}` 
      : phoneNumber

    // Update payment with phone number
    await supabase
      .from('payments')
      .update({ 
        ecocash_number: formattedPhone,
        status: 'processing',
        metadata: { initiated_at: new Date().toISOString() }
      })
      .eq('id', paymentId)

    return {
      success: true,
      message: 'EcoCash payment initiated',
      ussdPrompt: `Dial *151*2*1*${formattedPhone}*${amount}# to complete payment`
    }
  },

  /**
   * Confirm cash payment (driver confirms receipt)
   */
  async confirmCashPayment(paymentId: string, confirmerId: string): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        metadata: { confirmed_by: confirmerId }
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (error) return null
    return data
  },

  /**
   * Get payments for a user
   */
  async getUserPayments(userId: string, role: 'payer' | 'payee' | 'all' = 'all'): Promise<Payment[]> {
    let query = supabase.from('payments').select('*')
    
    if (role === 'payer') {
      query = query.eq('payer_id', userId)
    } else if (role === 'payee') {
      query = query.eq('payee_id', userId)
    } else {
      query = query.or(`payer_id.eq.${userId},payee_id.eq.${userId}`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  /**
   * Get payment for a specific load
   */
  async getLoadPayment(loadId: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('load_id', loadId)
      .single()

    if (error) return null
    return data
  },

  /**
   * Calculate earnings summary
   */
  async getEarningsSummary(userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<{
    totalEarnings: number
    completedPayments: number
    pendingPayments: number
    pendingAmount: number
    averagePerJob: number
    paymentMethods: Record<PaymentMethod, number>
  }> {
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
    }

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('payee_id', userId)
      .gte('created_at', startDate.toISOString())

    if (error) throw error

    const completed = payments?.filter(p => p.status === 'completed') || []
    const pending = payments?.filter(p => p.status === 'pending' || p.status === 'processing') || []

    const totalEarnings = completed.reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = pending.reduce((sum, p) => sum + p.amount, 0)

    const paymentMethods: Record<PaymentMethod, number> = {
      cash: 0,
      ecocash: 0,
      innbucks: 0,
      bank_transfer: 0
    }

    completed.forEach(p => {
      paymentMethods[p.payment_method as PaymentMethod] += p.amount
    })

    return {
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      completedPayments: completed.length,
      pendingPayments: pending.length,
      pendingAmount: Math.round(pendingAmount * 100) / 100,
      averagePerJob: completed.length > 0 
        ? Math.round((totalEarnings / completed.length) * 100) / 100 
        : 0,
      paymentMethods
    }
  }
}

export default paymentService
