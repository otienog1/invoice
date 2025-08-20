'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, User, Building, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { customerSchema, CustomerFormData } from '@/lib/validations';
import { customersApi } from '@/lib/api';
import { Customer } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CustomerCreateDialogProps {
  onCustomerCreated: (customer: Customer) => void;
  trigger?: React.ReactNode;
}

export function CustomerCreateDialog({ onCustomerCreated, trigger }: CustomerCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      tax_pin: '',
      company: '',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true);
      const customer = await customersApi.createCustomer(data);
      onCustomerCreated(customer);
      setOpen(false);
      reset();
      toast({
        title: "Customer created",
        description: `${customer.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create New Customer
          </DialogTitle>
          <DialogDescription>
            Add a new customer to your database. They'll be available for future invoices.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Name *
            </Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Enter customer name"
              className="w-full"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="customer@example.com"
              className="w-full"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Company and Phone in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </Label>
              <Input
                {...register('company')}
                id="company"
                placeholder="Company name"
              />
              {errors.company && (
                <p className="text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                {...register('phone')}
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              {...register('address')}
              id="address"
              placeholder="Customer address"
              rows={3}
              className="w-full"
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Tax PIN */}
          <div className="space-y-2">
            <Label htmlFor="tax_pin" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Tax PIN
            </Label>
            <Input
              {...register('tax_pin')}
              id="tax_pin"
              placeholder="Tax identification number"
            />
            {errors.tax_pin && (
              <p className="text-sm text-red-600">{errors.tax_pin.message}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}