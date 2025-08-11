'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { invoiceSchema, InvoiceFormData } from '@/lib/validations';
import { customersApi } from '@/lib/api';
import { Customer, CreateInvoiceData } from '@/types';
import { calculateInvoiceTotal } from '@/lib/utils';

interface InvoiceFormProps {
  onSubmit: (data: CreateInvoiceData) => void;
  loading: boolean;
}

export function InvoiceForm({ onSubmit, loading }: InvoiceFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [{ description: '', quantity: 1, rate: 0 }],
      tax_rate: 0,
      discount_rate: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('tax_rate');
  const watchedDiscountRate = watch('discount_rate');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await customersApi.getCustomers({
        per_page: 100,
        user_id: 1, // TODO: Get from auth context
      });
      setCustomers(response.items || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + (quantity * rate);
  }, 0);

  const { taxAmount, discountAmount, total } = calculateInvoiceTotal(
    subtotal,
    Number(watchedTaxRate) || 0,
    Number(watchedDiscountRate) || 0
  );

  const handleFormSubmit = (data: InvoiceFormData) => {
    const formattedData: CreateInvoiceData = {
      ...data,
      items: data.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
      })),
      tax_rate: Number(data.tax_rate),
      discount_rate: Number(data.discount_rate),
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
      {/* Customer Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
            Customer *
          </label>
          <select
            {...register('customer_id', { valueAsNumber: true })}
            className="input"
            disabled={loadingCustomers}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.company && `(${customer.company})`}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            {...register('due_date')}
            type="date"
            className="input"
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Title
          </label>
          <input
            {...register('title')}
            type="text"
            className="input"
            placeholder="e.g., Web Development Services"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="input"
          placeholder="Brief description of the work or services provided"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Invoice Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <button
            type="button"
            onClick={() => append({ description: '', quantity: 1, rate: 0 })}
            className="btn btn-secondary text-sm flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  {...register(`items.${index}.description`)}
                  type="text"
                  className="input"
                  placeholder="Item description"
                />
                {errors.items?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index]?.description?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qty *
                </label>
                <input
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  placeholder="1"
                />
                {errors.items?.[index]?.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index]?.quantity?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate *
                </label>
                <input
                  {...register(`items.${index}.rate`, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  placeholder="0.00"
                />
                {errors.items?.[index]?.rate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index]?.rate?.message}
                  </p>
                )}
              </div>

              <div className="col-span-10 md:col-span-1">
                <div className="text-sm font-medium text-gray-900">
                  ${((Number(watchedItems[index]?.quantity) || 0) * (Number(watchedItems[index]?.rate) || 0)).toFixed(2)}
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax and Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="tax_rate" className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate (%)
          </label>
          <input
            {...register('tax_rate', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            max="100"
            className="input"
            placeholder="0"
          />
          {errors.tax_rate && (
            <p className="mt-1 text-sm text-red-600">{errors.tax_rate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="discount_rate" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Rate (%)
          </label>
          <input
            {...register('discount_rate', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            max="100"
            className="input"
            placeholder="0"
          />
          {errors.discount_rate && (
            <p className="mt-1 text-sm text-red-600">{errors.discount_rate.message}</p>
          )}
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="input"
            placeholder="Additional notes for the customer"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
            Terms & Conditions
          </label>
          <textarea
            {...register('terms')}
            rows={3}
            className="input"
            placeholder="Payment terms and conditions"
          />
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="border-t border-gray-200 pt-6">
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount ({watchedDiscountRate}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax ({watchedTaxRate}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={loading}
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}