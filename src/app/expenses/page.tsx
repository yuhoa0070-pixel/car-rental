"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Search, 
  X, 
  Wrench, 
  Fuel, 
  ShieldAlert, 
  Sparkles, 
  Coins, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function ExpensesPage() {
  const { 
    expenses, 
    vehicles, 
    settings, 
    addExpense, 
    deleteExpense,
    currentStaff,
    t,
    language
  } = useApp();

  // Search/Filters state
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Form Fields
  const [vehicleId, setVehicleId] = useState('');
  const [type, setType] = useState<Expense['type']>('Gasoline');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [staff, setStaff] = useState('');
  const [note, setNote] = useState('');

  // Helper to open Add Expense Modal
  const handleOpenAdd = () => {
    setVehicleId(vehicles[0]?.id || '');
    setType('Gasoline');
    setAmount(25);
    setDate(new Date().toISOString().split('T')[0]);
    setStaff(currentStaff || settings.staffNames[0] || 'Staff');
    setNote('');
    setIsAddModalOpen(true);
  };

  // Helper to open Delete Confirm
  const handleOpenDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteConfirmOpen(true);
  };

  // Action Submits
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !type || amount <= 0 || !date) return;
    
    addExpense({
      vehicleId,
      type,
      amount,
      date,
      staff,
      note
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedExpense) return;
    deleteExpense(selectedExpense.id);
    setIsDeleteConfirmOpen(false);
  };

  // Translate expense types
  const translateExpenseType = (expType: string) => {
    if (language === 'km') {
      if (expType === 'Gasoline') return 'ប្រេងសាំង';
      if (expType === 'Repair') return 'ការជួសជុល';
      if (expType === 'Insurance') return 'ធានារ៉ាប់រង';
      if (expType === 'Car Wash') return 'លាងឡាន';
      if (expType === 'Oil Change') return 'ប្តូរប្រេងម៉ាស៊ីន';
      return 'ផ្សេងៗ';
    }
    return expType;
  };

  // Get Expense Icon based on type
  const getExpenseIcon = (expType: Expense['type']) => {
    switch (expType) {
      case 'Gasoline':
        return <Fuel className="h-4 w-4 text-amber-500" />;
      case 'Repair':
        return <Wrench className="h-4 w-4 text-red-500" />;
      case 'Insurance':
        return <ShieldAlert className="h-4 w-4 text-blue-500" />;
      case 'Car Wash':
        return <Sparkles className="h-4 w-4 text-indigo-500" />;
      case 'Oil Change':
        return <Coins className="h-4 w-4 text-emerald-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Filter logic
  const filteredExpenses = expenses.filter(exp => {
    const matchesVehicle = vehicleFilter === '' || exp.vehicleId === vehicleFilter;
    const matchesType = typeFilter === '' || exp.type === typeFilter;
    return matchesVehicle && matchesType;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const formatCurrency = (amt: number) => {
    return `${settings.currency}${amt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('expenses')}</h1>
          <p className="text-xs text-gray-500">{t('recordExp')}</p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={vehicles.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300/50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium shadow-sm transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('logExpense')}
        </button>
      </div>

      {/* KPI & Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{t('loggedExpenseTotal')}</span>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">{formatCurrency(totalFilteredAmount)}</h3>
            <p className="text-[10px] text-gray-400 mt-1">{t('sumFilteredOps')}</p>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <Receipt className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{t('expenseTransactions')}</span>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">{filteredExpenses.length}</h3>
            <p className="text-[10px] text-gray-400 mt-1">{t('numLoggedOps')}</p>
          </div>
          <div className="p-3 bg-gray-55/50 text-gray-500 rounded-xl border border-gray-150">
            <Receipt className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
        <span className="text-xs font-bold text-gray-700">{t('filters')}៖</span>
        
        {/* Vehicle Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-gray-400 uppercase">{t('vehicleFilter')}</label>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">{t('allVehicles')}</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.carName} ({v.plateNumber})</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-gray-400 uppercase">{t('categoryFilter')}</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">{t('allCategories')}</option>
            <option value="Gasoline">{translateExpenseType('Gasoline')}</option>
            <option value="Repair">{translateExpenseType('Repair')}</option>
            <option value="Insurance">{translateExpenseType('Insurance')}</option>
            <option value="Car Wash">{translateExpenseType('Car Wash')}</option>
            <option value="Oil Change">{translateExpenseType('Oil Change')}</option>
            <option value="Other">{translateExpenseType('Other')}</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(vehicleFilter !== '' || typeFilter !== '') && (
          <button
            onClick={() => { setVehicleFilter(''); setTypeFilter(''); }}
            className="sm:ml-auto text-[10px] text-gray-500 hover:text-black font-semibold hover:underline"
          >
            {t('resetFilters')}
          </button>
        )}
      </div>

      {/* Table grid */}
      {filteredExpenses.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">{t('expenseCategory')}</th>
                  <th className="px-6 py-3">{t('linkedVehicle')}</th>
                  <th className="px-6 py-3">{t('expenseDetails')}</th>
                  <th className="px-6 py-3">{t('loggingDate')}</th>
                  <th className="px-6 py-3">{t('loggedBy')}</th>
                  <th className="px-6 py-3">{t('amount')}</th>
                  <th className="px-6 py-3 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredExpenses.map((exp) => {
                  const car = vehicles.find(v => v.id === exp.vehicleId);
                  
                  return (
                    <tr key={exp.id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-md">
                            {getExpenseIcon(exp.type)}
                          </div>
                          <span className="font-semibold text-gray-900">{translateExpenseType(exp.type)}</span>
                        </div>
                      </td>

                      {/* Linked Vehicle */}
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex flex-col">
                          <span>{car?.carName || 'Deleted Car'}</span>
                          <span className="text-[9px] text-gray-400 font-mono mt-0.5">{car?.plateNumber}</span>
                        </div>
                      </td>

                      {/* Notes details */}
                      <td className="px-6 py-4 text-gray-500 max-w-sm">
                        <p className="truncate" title={exp.note || ''}>{exp.note || '---'}</p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600 font-mono">{exp.date}</td>

                      {/* Logged Staff */}
                      <td className="px-6 py-4 text-gray-600">{exp.staff}</td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-bold text-red-600">
                        -{formatCurrency(exp.amount)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDelete(exp)}
                          className="p-1 border border-transparent hover:border-red-100 hover:bg-red-50 text-red-500 rounded transition-all"
                          title={t('confirmDelete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <div className="inline-flex p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl mb-4">
            <Receipt className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">{t('noExpensesRecorded')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {vehicleFilter !== '' || typeFilter !== '' 
              ? t('noExpensesDescSearch') 
              : t('noExpensesDescEmpty')
            }
          </p>
          {!vehicleFilter && !typeFilter && vehicles.length > 0 && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('logExpense')}
            </button>
          )}
        </div>
      )}

      {/* Modal: Add Expense */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md w-full overflow-hidden relative z-10">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-900">{t('logOperationalExpense')}</span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-750 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs font-medium">
              {/* Select vehicle */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('linkToFleet')}</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.carName} ({v.plateNumber})</option>
                  ))}
                </select>
              </div>

              {/* Type and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('expenseCategory')}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Gasoline">{translateExpenseType('Gasoline')}</option>
                    <option value="Repair">{translateExpenseType('Repair')}</option>
                    <option value="Insurance">{translateExpenseType('Insurance')}</option>
                    <option value="Car Wash">{translateExpenseType('Car Wash')}</option>
                    <option value="Oil Change">{translateExpenseType('Oil Change')}</option>
                    <option value="Other">{translateExpenseType('Other')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('amount')} ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Date and Staff */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('date')}</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">{t('loggedBy')}</label>
                  <select
                    value={staff}
                    onChange={(e) => setStaff(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {settings.staffNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">{t('expenseNoteRef')}</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Shell refuel station, invoice receipt #76231"
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              {/* Footer buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  {t('logExpense')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete */}
      {isDeleteConfirmOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs" onClick={() => setIsDeleteConfirmOpen(false)} />
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-sm w-full overflow-hidden relative z-10 text-xs">
            <div className="p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{t('deleteExpenseRecord')}</h3>
              <p className="text-gray-500 mt-2">
                {t('deleteExpenseDesc', { amount: formatCurrency(selectedExpense.amount) })}
              </p>
            </div>
            
            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-750 font-semibold rounded-lg"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
              >
                {t('confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
