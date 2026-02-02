'use client'

import { useState } from 'react'
import { 
  PAYMENT_METHODS, 
  calculateTotalWithFee, 
  type PaymentMethod,
  type PaymentMethodInfo
} from '@/services/paymentService'
import { formatCurrency } from '@/services/freightCalculator'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  loadId: string
  payeeId: string
  payeeName: string
  onPaymentComplete: (paymentId: string, method: PaymentMethod) => void
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  loadId,
  payeeId,
  payeeName,
  onPaymentComplete
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ecocash')
  const [ecocashNumber, setEcocashNumber] = useState('')
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select')
  const [error, setError] = useState('')

  const { subtotal, fee, total } = calculateTotalWithFee(amount, selectedMethod)
  const methodInfo = PAYMENT_METHODS.find(m => m.id === selectedMethod)

  const handlePayment = async () => {
    setError('')
    
    if (selectedMethod === 'ecocash' && !ecocashNumber) {
      setError('Please enter your EcoCash number')
      return
    }

    if (selectedMethod === 'ecocash' && !/^0[0-9]{9}$/.test(ecocashNumber)) {
      setError('Please enter a valid phone number (e.g., 0771234567)')
      return
    }

    setStep('processing')

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setStep('success')
    
    // In production, this would call paymentService.createPayment()
    const mockPaymentId = `PAY-${Date.now()}`
    onPaymentComplete(mockPaymentId, selectedMethod)
  }

  const resetModal = () => {
    setStep('select')
    setSelectedMethod('ecocash')
    setEcocashNumber('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Payment</h2>
            <button 
              onClick={resetModal}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <p className="text-gray-300 text-sm">Pay to</p>
            <p className="font-semibold text-lg">{payeeName}</p>
          </div>
          <div className="mt-4 text-center py-4 bg-white/10 rounded-xl">
            <p className="text-gray-300 text-sm">Amount Due</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(total)}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'select' && (
            <>
              {/* Payment Methods */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
                {PAYMENT_METHODS.filter(m => m.available).map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedMethod === method.id}
                    onSelect={() => setSelectedMethod(method.id)}
                  />
                ))}
              </div>

              {/* EcoCash Number Input */}
              {selectedMethod === 'ecocash' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EcoCash Phone Number
                  </label>
                  <input
                    type="tel"
                    value={ecocashNumber}
                    onChange={(e) => setEcocashNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="0771234567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You will receive a USSD prompt to confirm payment
                  </p>
                </div>
              )}

              {/* InnBucks Number Input */}
              {selectedMethod === 'innbucks' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    InnBucks Phone Number
                  </label>
                  <input
                    type="tel"
                    value={ecocashNumber}
                    onChange={(e) => setEcocashNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="0771234567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Processing Fee ({methodInfo?.fee}%)
                    </span>
                    <span>{formatCurrency(fee)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => setStep('confirm')}
                className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Continue to Pay {formatCurrency(total)}
              </button>
            </>
          )}

          {step === 'confirm' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Payment</h3>
              <p className="text-gray-600 mb-6">
                You are about to pay <strong>{formatCurrency(total)}</strong> to{' '}
                <strong>{payeeName}</strong> via <strong>{methodInfo?.name}</strong>
              </p>

              {selectedMethod === 'ecocash' && (
                <div className="p-4 bg-green-50 rounded-xl mb-6">
                  <p className="text-sm text-green-800">
                    📱 A USSD prompt will be sent to <strong>{ecocashNumber}</strong>
                  </p>
                </div>
              )}

              {selectedMethod === 'cash' && (
                <div className="p-4 bg-gray-50 rounded-xl mb-6">
                  <p className="text-sm text-gray-700">
                    💵 Please pay the driver in cash upon delivery. The driver will confirm receipt in the app.
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">
                {selectedMethod === 'ecocash' && 'Please check your phone for the EcoCash prompt...'}
                {selectedMethod === 'cash' && 'Recording cash payment...'}
                {selectedMethod === 'bank_transfer' && 'Processing bank transfer...'}
                {selectedMethod === 'innbucks' && 'Please check your phone for the InnBucks prompt...'}
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your payment of {formatCurrency(total)} has been{' '}
                {selectedMethod === 'cash' ? 'recorded' : 'processed'} successfully.
              </p>
              <button
                onClick={resetModal}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Payment Method Card Component
function PaymentMethodCard({
  method,
  selected,
  onSelect
}: {
  method: PaymentMethodInfo
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{method.icon}</span>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{method.name}</p>
          <p className="text-sm text-gray-500">{method.description}</p>
        </div>
        {method.fee > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {method.fee}% fee
          </span>
        )}
        {selected && (
          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}

// Quick Pay Button Component
interface QuickPayButtonProps {
  amount: number
  loadId: string
  payeeId: string
  payeeName: string
  onComplete?: (paymentId: string) => void
}

export function QuickPayButton({ amount, loadId, payeeId, payeeName, onComplete }: QuickPayButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
      >
        <span>💳</span>
        <span>Pay {formatCurrency(amount)}</span>
      </button>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        amount={amount}
        loadId={loadId}
        payeeId={payeeId}
        payeeName={payeeName}
        onPaymentComplete={(paymentId, method) => {
          onComplete?.(paymentId)
          setShowModal(false)
        }}
      />
    </>
  )
}

export default PaymentModal
