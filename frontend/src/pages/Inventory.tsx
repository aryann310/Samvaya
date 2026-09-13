import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonTable } from '../components/ui/SkeletonLoader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

export default function Inventory() {
  const { t } = useTranslation();
  const { businessId, loading: ctxLoading } = useBusiness();
  const { data: inventoryData, loading: dataLoading, refetch } = useApi(
    () => getInventory(businessId!),
    [businessId]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', category: '', quantity: 0, unit: '', reorderLevel: 0, unitCost: 0, salePrice: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = ctxLoading || dataLoading || !inventoryData;

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ name: '', category: '', quantity: 0, unit: '', reorderLevel: 0, unitCost: 0, salePrice: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, formData);
      } else {
        await addInventoryItem(businessId!, formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await deleteInventoryItem(id);
        refetch();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('inventory.title')} />
        <SkeletonTable />
      </div>
    );
  }

  const filteredData = inventoryData.filter((item: any) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { label: t('inventory.name'), key: 'name' },
    { label: t('inventory.category'), key: 'category' },
    { 
      label: t('inventory.quantity'), 
      key: 'quantity',
      render: (val: number, item: any) => (
        <span className={val <= item.reorderLevel ? 'text-danger font-bold' : ''}>
          {val} {item.unit}
        </span>
      )
    },
    { 
      label: t('inventory.price'), 
      key: 'salePrice',
      render: (val: any) => formatINR(val)
    },
    {
      label: t('inventory.status'),
      key: 'status',
      render: (val: string, item: any) => {
        let status = 'success';
        let label = t('inventory.inStock');
        if (item.quantity === 0) {
          status = 'danger';
          label = t('inventory.outOfStock');
        } else if (item.quantity <= item.reorderLevel) {
          status = 'warning';
          label = t('inventory.lowStock');
        }
        return <StatusBadge status={status as any} label={label} />;
      }
    },
    {
      label: t('common.actions'),
      key: 'id',
      render: (val: string, item: any) => (
        <div className="flex space-x-2">
          <button onClick={() => handleOpenModal(item)} className="p-1.5 text-[#38BDF8] hover:bg-[#38BDF8]/15 rounded-lg transition-colors" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/15 rounded-lg transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 min-h-screen">
      <PageHeader 
        title={t('inventory.title', 'Inventory & Stock Tracker')} 
        action={{
          label: t('inventory.addItem', 'Add Item'),
          onClick: () => handleOpenModal(),
          icon: <Plus size={18} className="mr-2" />
        }}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card/70 backdrop-blur-md border border-glass-border p-5 rounded-3xl shadow-glass-shadow text-center">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">{t('inventory.totalItems', 'Total Items')}</p>
          <p className="text-2xl font-black text-foreground">{inventoryData.length}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl shadow-glass-shadow text-center">
          <p className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 mb-1">{t('inventory.lowStock', 'Low Stock')}</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {inventoryData.filter((i: any) => i.quantity > 0 && i.quantity <= i.reorderLevel).length}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl shadow-glass-shadow text-center">
          <p className="text-xs uppercase tracking-wider font-bold text-red-600 dark:text-red-400 mb-1">{t('inventory.outOfStock', 'Out of Stock')}</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">
            {inventoryData.filter((i: any) => i.quantity === 0).length}
          </p>
        </div>
        <div className="bg-lime-500/10 border border-lime-500/20 p-5 rounded-3xl shadow-glass-shadow text-center">
          <p className="text-xs uppercase tracking-wider font-bold text-lime-700 dark:text-lime-400 mb-1">{t('inventory.totalValue', 'Total Valuation')}</p>
          <p className="text-2xl font-black text-lime-700 dark:text-lime-400">
            {formatINR(inventoryData.reduce((acc: number, item: any) => acc + (item.quantity * item.unitCost), 0))}
          </p>
        </div>
      </div>

      <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between mb-5 gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder={t('common.search', 'Search inventory...')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border border-border text-foreground placeholder:text-muted-foreground pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full transition-all"
            />
          </div>
          <button onClick={() => alert('Coming soon!')} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-sm font-semibold transition-colors">
            <Filter size={16} className="text-primary" /> {t('common.filter', 'Filter')}
          </button>
        </div>

        <DataTable columns={columns} data={filteredData} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? t('inventory.editItem', 'Edit Product') : t('inventory.addItem', 'Add New Product')}
        footer={
          <div className="flex justify-end space-x-3 w-full">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors">
              {t('common.cancel', 'Cancel')}
            </button>
            <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-bold shadow-xs transition-all">
              {t('common.save', 'Save Product')}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.name', 'Item Name')}</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.category', 'Category')}</label>
            <input 
              type="text" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.unit', 'Unit')}</label>
            <input 
              type="text" 
              value={formData.unit} 
              onChange={e => setFormData({...formData, unit: e.target.value})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
              placeholder="kg, pcs, liters"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.quantity', 'Current Quantity')}</label>
            <input 
              type="number" 
              value={formData.quantity} 
              onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.reorderLevel', 'Reorder Alert Threshold')}</label>
            <input 
              type="number" 
              value={formData.reorderLevel} 
              onChange={e => setFormData({...formData, reorderLevel: Number(e.target.value)})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.unitCost', 'Cost per Unit (₹)')}</label>
            <input 
              type="number" 
              value={formData.unitCost} 
              onChange={e => setFormData({...formData, unitCost: Number(e.target.value)})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t('inventory.sellingPrice', 'Selling Price (₹)')}</label>
            <input 
              type="number" 
              value={formData.salePrice} 
              onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} 
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
