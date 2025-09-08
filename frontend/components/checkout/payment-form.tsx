"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Building2, Shield, AlertCircle } from "lucide-react"

interface PaymentFormProps {
  paymentMethod: string
  onPaymentMethodChange: (method: string) => void
  onNext: () => void
  onBack: () => void
}

export function PaymentForm({ paymentMethod, onPaymentMethodChange, onNext, onBack }: PaymentFormProps) {
  // Card payment fields
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  
  // M-Pesa fields
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [mpesaName, setMpesaName] = useState("")
  
  // Bank transfer fields
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [reference, setReference] = useState("")
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method"
      return false
    }

    switch (paymentMethod) {
      case "card":
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
          newErrors.cardNumber = "Please enter a valid card number"
        }
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
          newErrors.expiry = "Please enter expiry date in MM/YY format"
        }
        if (!cvv || cvv.length < 3) {
          newErrors.cvv = "Please enter a valid CVV"
        }
        if (!cardholderName.trim()) {
          newErrors.cardholderName = "Please enter cardholder name"
        }
        break
      
      case "mpesa":
        if (!mpesaNumber || mpesaNumber.length < 10) {
          newErrors.mpesaNumber = "Please enter a valid M-Pesa number"
        }
        if (!mpesaName.trim()) {
          newErrors.mpesaName = "Please enter your name"
        }
        break
      
      case "bank":
        if (!bankName.trim()) {
          newErrors.bankName = "Please select a bank"
        }
        if (!accountNumber.trim()) {
          newErrors.accountNumber = "Please enter account number"
        }
        if (!accountName.trim()) {
          newErrors.accountName = "Please enter account name"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Choose Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={onPaymentMethodChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="mpesa" id="mpesa" />
              <Label htmlFor="mpesa" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">M-Pesa</div>
                  <div className="text-sm text-muted-foreground">Pay with your mobile money</div>
                </div>
                <Badge variant="secondary" className="ml-auto">Popular</Badge>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Building2 className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">Direct bank transfer</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          {errors.paymentMethod && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.paymentMethod}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      {paymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle>
              {paymentMethod === "card" && "Card Details"}
              {paymentMethod === "mpesa" && "M-Pesa Details"}
              {paymentMethod === "bank" && "Bank Transfer Details"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                    />
                    {errors.cardholderName && (
                      <p className="text-sm text-destructive mt-1">{errors.cardholderName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiry && (
                        <p className="text-sm text-destructive mt-1">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* M-Pesa Payment Form */}
              {paymentMethod === "mpesa" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
                    <Input
                      id="mpesaNumber"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="0712345678"
                      maxLength={10}
                    />
                    {errors.mpesaNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.mpesaNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="mpesaName">Full Name</Label>
                    <Input
                      id="mpesaName"
                      value={mpesaName}
                      onChange={(e) => setMpesaName(e.target.value)}
                      placeholder="John Doe"
                    />
                    {errors.mpesaName && (
                      <p className="text-sm text-destructive mt-1">{errors.mpesaName}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> You will receive an M-Pesa prompt on your phone to complete the payment.
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Transfer Form */}
              {paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select value={bankName} onValueChange={setBankName}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kcb">Kenya Commercial Bank (KCB)</SelectItem>
                        <SelectItem value="equity">Equity Bank</SelectItem>
                        <SelectItem value="coop">Co-operative Bank</SelectItem>
                        <SelectItem value="absa">Absa Bank Kenya</SelectItem>
                        <SelectItem value="ncba">NCBA Bank</SelectItem>
                        <SelectItem value="standard">Standard Chartered Bank</SelectItem>
                        <SelectItem value="diamond">Diamond Trust Bank</SelectItem>
                        <SelectItem value="family">Family Bank</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.bankName && (
                      <p className="text-sm text-destructive mt-1">{errors.bankName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter your account number"
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.accountNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Enter account holder name"
                    />
                    {errors.accountName && (
                      <p className="text-sm text-destructive mt-1">{errors.accountName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="reference">Payment Reference (Optional)</Label>
                    <Input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Enter reference for your records"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Please include your order number as the payment reference when making the transfer.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue to Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
